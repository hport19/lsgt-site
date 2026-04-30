import { mkdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export type AnalyticsEvent = {
  id: string;
  sessionId: string;
  eventType: string;
  pagePath: string;
  elementId?: string;
  elementText?: string;
  section?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

type StoredReport = {
  weekKey: string;
  sentAt: string;
  recipient: string;
  eventCount: number;
};

function analyticsDir() {
  return process.env.ANALYTICS_DATA_DIR || path.join("/tmp", "lsgt-analytics");
}

function eventsFile() {
  return process.env.ANALYTICS_EVENTS_FILE || path.join(analyticsDir(), "events.jsonl");
}

function reportsFile() {
  return process.env.ANALYTICS_REPORT_LOG_FILE || path.join(analyticsDir(), "weekly-reports.jsonl");
}

async function ensureDir() {
  await mkdir(analyticsDir(), { recursive: true });
}

function cleanText(value: unknown, max = 500) {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  if (!text) return undefined;
  return text.length > max ? text.slice(0, max) : text;
}

function cleanMetadata(metadata: unknown): Record<string, unknown> | undefined {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  const entries = Object.entries(metadata as Record<string, unknown>)
    .slice(0, 40)
    .map(([key, value]) => {
      if (typeof value === "string") return [key.slice(0, 80), value.slice(0, 800)] as const;
      if (typeof value === "number" || typeof value === "boolean" || value === null) return [key.slice(0, 80), value] as const;
      return [key.slice(0, 80), JSON.stringify(value).slice(0, 800)] as const;
    });
  return Object.fromEntries(entries);
}

export function normalizeAnalyticsEvent(input: Partial<AnalyticsEvent>): AnalyticsEvent | null {
  const eventType = cleanText(input.eventType, 80);
  const pagePath = cleanText(input.pagePath, 240);
  const sessionId = cleanText(input.sessionId, 160);
  if (!eventType || !pagePath || !sessionId) return null;

  const timestamp = input.timestamp && !Number.isNaN(Date.parse(input.timestamp)) ? input.timestamp : new Date().toISOString();

  return {
    id: cleanText(input.id, 160) || crypto.randomUUID(),
    sessionId,
    eventType,
    pagePath,
    elementId: cleanText(input.elementId, 180),
    elementText: cleanText(input.elementText, 280),
    section: cleanText(input.section, 120),
    timestamp,
    metadata: cleanMetadata(input.metadata),
    utmSource: cleanText(input.utmSource, 120),
    utmMedium: cleanText(input.utmMedium, 120),
    utmCampaign: cleanText(input.utmCampaign, 180),
    utmContent: cleanText(input.utmContent, 180),
    utmTerm: cleanText(input.utmTerm, 180),
  };
}

export async function appendAnalyticsEvents(events: AnalyticsEvent[]) {
  if (!events.length) return;
  await ensureDir();
  const lines = `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
  await writeFile(eventsFile(), lines, { flag: "a" });
}

export async function readAnalyticsEvents(options: { since?: Date; until?: Date; limit?: number } = {}) {
  try {
    await stat(eventsFile());
  } catch {
    return [] as AnalyticsEvent[];
  }

  const raw = await readFile(eventsFile(), "utf8");
  const lines = raw.split("\n").filter(Boolean);
  const events: AnalyticsEvent[] = [];
  const sinceMs = options.since?.getTime() ?? 0;
  const untilMs = options.until?.getTime() ?? Number.POSITIVE_INFINITY;

  for (const line of lines) {
    try {
      const event = JSON.parse(line) as AnalyticsEvent;
      const ts = Date.parse(event.timestamp);
      if (Number.isNaN(ts) || ts < sinceMs || ts > untilMs) continue;
      events.push(event);
    } catch {}
  }

  const limit = options.limit ?? 5000;
  return events.slice(Math.max(0, events.length - limit));
}

export async function readReportLog() {
  try {
    await stat(reportsFile());
  } catch {
    return [] as StoredReport[];
  }

  const raw = await readFile(reportsFile(), "utf8");
  return raw
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as StoredReport];
      } catch {
        return [];
      }
    });
}

export async function appendReportLog(report: StoredReport) {
  await ensureDir();
  await writeFile(reportsFile(), `${JSON.stringify(report)}\n`, { flag: "a" });
}
