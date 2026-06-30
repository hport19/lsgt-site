import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { assertEmailReady, createMailer } from "@/src/lib/email";

export const runtime = "nodejs";

type TicketBody = {
  type?: "support" | "project" | "msp" | "provider";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  leadSource?: string;
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

function isAllowedResume(file: File) {
  const allowedTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  const allowedExt = /\.(pdf|doc|docx)$/i.test(file.name);
  return allowedTypes.has(file.type) || allowedExt;
}

async function parseBody(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const body: TicketBody = {
      type: clean(fd.get("type"), 40) as TicketBody["type"],
      name: clean(fd.get("name"), 120),
      email: clean(fd.get("email"), 180),
      phone: clean(fd.get("phone"), 80),
      company: clean(fd.get("company"), 140),
      message: clean(fd.get("message"), 4000),
      website: clean(fd.get("website"), 200),
    };
    return { body, formData: fd };
  }

  const body = (await req.json()) as TicketBody;
  return { body, formData: null };
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
  let formData: FormData | null;
  try {
    const parsed = await parseBody(req);
    body = parsed.body;
    formData = parsed.formData;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: bots fill this
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const type = (body.type === "msp"
    ? "msp"
    : body.type === "project"
    ? "project"
    : body.type === "provider"
    ? "provider"
    : "support") as "support" | "project" | "msp" | "provider";

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const phone = clean(body.phone, 80);
  const company = clean(body.company, 140);
  const message = clean(body.message, 4000);
  const leadSource = clean(body.leadSource, 120);
  const isProvider = type === "provider";

  if (!name || !email || (!message && !isProvider)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  let attachment:
    | {
        filename: string;
        content: Buffer;
        contentType?: string;
      }
    | undefined;

  if (type === "provider") {
    const positionApplyingFor = clean(formData?.get("positionApplyingFor"), 160);
    const experience = clean(formData?.get("experience"), 2400);
    const hasCareersFields = Boolean(positionApplyingFor && experience);
    const requiredProviderFields = ["cityState", "availability", "experienceLevel", "areasExperience", "transportation", "tools"];
    const missingProviderField = requiredProviderFields.find((field) => !clean(formData?.get(field), 1200));

    if (!phone || (!hasCareersFields && missingProviderField)) {
      return NextResponse.json({ error: "Missing required provider application fields" }, { status: 400 });
    }

    const resume = formData?.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: "Resume upload is required" }, { status: 400 });
    }
    if (resume.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Resume must be 10 MB or smaller" }, { status: 400 });
    }
    if (!isAllowedResume(resume)) {
      return NextResponse.json({ error: "Resume must be a PDF, DOC, or DOCX file" }, { status: 400 });
    }

    attachment = {
      filename: resume.name || "resume",
      content: Buffer.from(await resume.arrayBuffer()),
      contentType: resume.type || undefined,
    };
  }

  const supportTo = process.env.SUPPORT_TO;
  const salesTo = process.env.SALES_TO;
  const providerTo = process.env.PROVIDER_TO || process.env.CAREERS_TO;
  const legacyTo = process.env.TICKETS_TO;

  const to =
    type === "support"
      ? supportTo || legacyTo
      : type === "provider"
      ? providerTo || salesTo || legacyTo
      : type === "project" || type === "msp"
      ? salesTo || legacyTo
      : legacyTo;

  const emailReady = assertEmailReady();
  if (!to || !emailReady.ok) {
    return NextResponse.json(
      {
        error: "Server not configured (missing env)",
        missing: {
          SUPPORT_TO: type === "support" ? !(supportTo || legacyTo) : false,
          SALES_TO: type === "project" || type === "msp" ? !(salesTo || legacyTo) : false,
          PROVIDER_TO: type === "provider" ? !(providerTo || salesTo || legacyTo) : false,
          TICKETS_TO: !legacyTo, // legacy fallback
          ...(emailReady.ok ? {} : emailReady.missing),
        },
      },
      { status: 500 }
    );
  }

  const providerPosition = type === "provider" && formData ? clean(formData.get("positionApplyingFor"), 160) : "";

  const subject = `[GlobalTech] ${type.toUpperCase()} request — ${name}${
    providerPosition ? ` — ${providerPosition}` : company ? ` (${company})` : ""
  }`;

  const providerDetails =
    type === "provider" && formData
      ? [
          clean(formData.get("firstName"), 80) ? `First name: ${clean(formData.get("firstName"), 80)}` : "",
          clean(formData.get("lastName"), 80) ? `Last name: ${clean(formData.get("lastName"), 80)}` : "",
          providerPosition ? `Position: ${providerPosition}` : "",
          clean(formData.get("experience"), 2400) ? `Experience: ${clean(formData.get("experience"), 2400)}` : "",
          clean(formData.get("cityState"), 160) ? `City/State: ${clean(formData.get("cityState"), 160)}` : "",
          clean(formData.get("availability"), 160) ? `Availability: ${clean(formData.get("availability"), 160)}` : "",
          clean(formData.get("experienceLevel"), 160) ? `Experience level: ${clean(formData.get("experienceLevel"), 160)}` : "",
          clean(formData.get("areasExperience"), 1200) ? `Areas of experience: ${clean(formData.get("areasExperience"), 1200)}` : "",
          clean(formData.get("transportation"), 240) ? `Transportation: ${clean(formData.get("transportation"), 240)}` : "",
          clean(formData.get("tools"), 800) ? `Tools/equipment: ${clean(formData.get("tools"), 800)}` : "",
          clean(formData.get("certifications"), 800) ? `Certifications: ${clean(formData.get("certifications"), 800)}` : "",
        ]
          .filter(Boolean)
      : [];

  const text = [
    `Type: ${type}`,
    leadSource ? `Lead source: ${leadSource}` : "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    company ? `Company: ${company}` : "",
    ...providerDetails,
    `IP: ${ip}`,
    "",
    message ? "Message:" : "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await createMailer().sendMail({
      from: emailReady.config.from,
      to,
      replyTo: email,
      subject,
      text,
      attachments: attachment ? [attachment] : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Email failed to send" }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/tickets" });
}
