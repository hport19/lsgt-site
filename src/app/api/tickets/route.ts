import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type TicketBody = {
  type?: "support" | "project" | "msp";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  website?: string; // honeypot
  turnstileToken?: string; // optional (future)
};

const RATE_WINDOW_MS = 60_000; // 1 min
const RATE_MAX = 6; // 6 req/min per IP
const rate = new Map<string, { count: number; resetAt: number }>();

async function getClientIp() {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

async function allowOrigin() {
  const h = await headers();
  const origin = h.get("origin") || "";
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return true;
    }
  }

  // If ALLOWED_ORIGINS isn't configured yet, don't block.
  if (allowed.length === 0) return true;

  return allowed.includes(origin);
}

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = rate.get(ip);

  if (!entry || now > entry.resetAt) {
    rate.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_MAX) return false;

  entry.count += 1;
  rate.set(ip, entry);
  return true;
}

function clean(s: unknown, max = 5000) {
  const v = String(s ?? "").trim();
  return v.length > max ? v.slice(0, max) : v;
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  const ip = await getClientIp();

  if (!(await allowOrigin())) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429 }
    );
  }

  let body: TicketBody;
  try {
    body = (await req.json()) as TicketBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill this
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const type = (body.type === "msp"
    ? "msp"
    : body.type === "project"
    ? "project"
    : "support") as "support" | "project" | "msp";

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const phone = clean(body.phone, 80);
  const company = clean(body.company, 140);
  const message = clean(body.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supportTo = process.env.SUPPORT_TO;
  const salesTo = process.env.SALES_TO;
  const legacyTo = process.env.TICKETS_TO;
  const from = process.env.TICKETS_FROM;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const to =
    type === "support"
      ? supportTo || legacyTo
      : type === "project" || type === "msp"
      ? salesTo || legacyTo
      : legacyTo;

  if (!to || !from || !smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json(
      {
        error: "Server not configured (missing env)",
        missing: {
          SUPPORT_TO: type === "support" ? !(supportTo || legacyTo) : false,
          SALES_TO: type === "project" || type === "msp" ? !(salesTo || legacyTo) : false,
          TICKETS_TO: !legacyTo, // legacy fallback
          TICKETS_FROM: !from,
          SMTP_HOST: !smtpHost,
          SMTP_USER: !smtpUser,
          SMTP_PASS: !smtpPass,
        },
      },
      { status: 500 }
    );
  }

  const subject = `[GlobalTech] ${type.toUpperCase()} request — ${name}${
    company ? ` (${company})` : ""
  }`;

  const text = [
    `Type: ${type}`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    company ? `Company: ${company}` : "",
    `IP: ${ip}`,
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Email failed to send" }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/tickets" });
}
