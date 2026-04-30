import { NextResponse } from "next/server";
import { appendAnalyticsEvents, normalizeAnalyticsEvent, readAnalyticsEvents, type AnalyticsEvent } from "@/src/lib/analytics-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: { events?: Partial<AnalyticsEvent>[] } | Partial<AnalyticsEvent>;

  try {
    payload = (await req.json()) as { events?: Partial<AnalyticsEvent>[] } | Partial<AnalyticsEvent>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = Array.isArray((payload as { events?: Partial<AnalyticsEvent>[] }).events)
    ? (payload as { events: Partial<AnalyticsEvent>[] }).events
    : [payload as Partial<AnalyticsEvent>];

  const events = incoming.flatMap((event) => {
    const normalized = normalizeAnalyticsEvent(event);
    return normalized ? [normalized] : [];
  });

  if (!events.length) {
    return NextResponse.json({ error: "No valid events" }, { status: 400 });
  }

  await appendAnalyticsEvents(events);
  return NextResponse.json({ ok: true, stored: events.length });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-analytics-secret");

  if (process.env.ANALYTICS_READ_SECRET && secret !== process.env.ANALYTICS_READ_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const events = await readAnalyticsEvents({ since, limit: 10000 });

  return NextResponse.json({ ok: true, days, count: events.length, events });
}
