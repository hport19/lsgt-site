import { NextResponse } from "next/server";
import { appendReportLog, readAnalyticsEvents, readReportLog, type AnalyticsEvent } from "@/src/lib/analytics-store";
import { assertEmailReady, createMailer } from "@/src/lib/email";
import { SITE } from "@/src/lib/site-config";

export const runtime = "nodejs";

type CountRow = { label: string; count: number };

function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function pct(part: number, whole: number) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

function avg(numbers: number[]) {
  if (!numbers.length) return 0;
  return Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length);
}

function topCounts(values: Array<string | undefined>, limit = 5): CountRow[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = value || "(not set)";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function list(rows: CountRow[]) {
  if (!rows.length) return "<li>No data yet.</li>";
  return rows.map((row) => `<li><strong>${escapeHtml(row.label)}</strong>: ${row.count}</li>`).join("");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char] || char;
  });
}

function eventNumber(event: AnalyticsEvent, key: string) {
  const value = event.metadata?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function buildReport(events: AnalyticsEvent[]) {
  const sessions = new Set(events.map((event) => event.sessionId));
  const pageViews = events.filter((event) => event.eventType === "page_view");
  const landingEvents = events.filter((event) => event.pagePath.startsWith("/msp"));
  const landingSessions = new Set(landingEvents.map((event) => event.sessionId));
  const landingViews = landingEvents.filter((event) => event.eventType === "page_view");
  const formStarts = events.filter((event) => event.eventType === "form_start");
  const formSubmits = events.filter((event) => event.eventType === "form_submit");
  const landingFormStarts = landingEvents.filter((event) => event.eventType === "form_start");
  const landingFormSubmits = landingEvents.filter((event) => event.eventType === "form_submit");
  const clicks = events.filter((event) => event.eventType === "click");
  const ctaClicks = clicks.filter((event) =>
    /consultation|technician|support|assessment|quick plan|cta|form/i.test(`${event.elementId || ""} ${event.elementText || ""}`)
  );
  const timeEvents = events.filter((event) => event.eventType === "time_on_page");
  const landingTimeEvents = landingEvents.filter((event) => event.eventType === "time_on_page");

  const avgTimeMs = avg(timeEvents.map((event) => eventNumber(event, "durationMs")).filter(Boolean));
  const avgLandingTimeMs = avg(landingTimeEvents.map((event) => eventNumber(event, "durationMs")).filter(Boolean));
  const avgScrollDepth = avg(timeEvents.map((event) => eventNumber(event, "maxScrollDepth")).filter(Boolean));
  const avgLandingScrollDepth = avg(landingTimeEvents.map((event) => eventNumber(event, "maxScrollDepth")).filter(Boolean));

  const topPages = topCounts(pageViews.map((event) => event.pagePath));
  const topLandingSources = topCounts(landingViews.map((event) => [event.utmSource, event.utmMedium].filter(Boolean).join(" / ") || "direct"));
  const topCtas = topCounts(ctaClicks.map((event) => event.elementText || event.elementId));
  const exitIndicators = topCounts(timeEvents.map((event) => event.pagePath));

  const insights: string[] = [];
  if (landingSessions.size > 0 && landingFormSubmits.length / landingSessions.size < 0.04) {
    insights.push("The MSP landing page is getting traffic, but conversion is below 4%. Review the above-fold offer and form friction.");
  }
  if (landingFormStarts.length > landingFormSubmits.length * 2 && landingFormStarts.length > 3) {
    insights.push("Many visitors start the MSP form but do not finish it. Consider shortening fields or clarifying what happens after submission.");
  }
  if (avgLandingScrollDepth < 50 && landingSessions.size > 5) {
    insights.push("Most MSP visitors are not reaching the middle of the page. Keep the strongest trust proof and form near the top.");
  }
  if (topCtas[0]) {
    insights.push(`Top CTA this week: "${topCtas[0].label}". Use similar wording in other high-traffic sections.`);
  }
  if (!insights.length) {
    insights.push("Traffic is still building. Keep watching CTA clicks, form starts, and completed submissions for clear patterns.");
  }

  return {
    totalVisitors: sessions.size,
    totalPageViews: pageViews.length,
    landingVisitors: landingSessions.size,
    landingPageViews: landingViews.length,
    landingConversionRate: pct(landingFormSubmits.length, landingSessions.size),
    landingFormStarts: landingFormStarts.length,
    landingFormSubmits: landingFormSubmits.length,
    landingDropOffRate: pct(Math.max(0, landingFormStarts.length - landingFormSubmits.length), landingFormStarts.length),
    avgTimeSeconds: Math.round(avgTimeMs / 1000),
    avgLandingTimeSeconds: Math.round(avgLandingTimeMs / 1000),
    avgScrollDepth,
    avgLandingScrollDepth,
    topPages,
    topLandingSources,
    topCtas,
    exitIndicators,
    totalFormSubmits: formSubmits.length,
    totalFormStarts: formStarts.length,
    insights,
  };
}

function reportHtml(report: ReturnType<typeof buildReport>, from: Date, to: Date) {
  const period = `${from.toLocaleDateString("en-US")} - ${to.toLocaleDateString("en-US")}`;
  return `
    <div style="font-family:Arial,sans-serif;color:#102033;line-height:1.5">
      <h1 style="margin:0 0 8px">Weekly Website Analytics</h1>
      <p style="margin:0 0 24px;color:#516071">${SITE.brand} performance report for ${period}</p>

      <h2>Landing Page Performance</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;background:#f7fbff">
        <tr><td>MSP visitors</td><td><strong>${report.landingVisitors}</strong></td></tr>
        <tr><td>MSP page views</td><td><strong>${report.landingPageViews}</strong></td></tr>
        <tr><td>Conversion rate</td><td><strong>${report.landingConversionRate}</strong></td></tr>
        <tr><td>Form starts / submissions</td><td><strong>${report.landingFormStarts} / ${report.landingFormSubmits}</strong></td></tr>
        <tr><td>Form drop-off rate</td><td><strong>${report.landingDropOffRate}</strong></td></tr>
        <tr><td>Avg. time on MSP page</td><td><strong>${report.avgLandingTimeSeconds}s</strong></td></tr>
        <tr><td>Avg. scroll depth</td><td><strong>${report.avgLandingScrollDepth}%</strong></td></tr>
      </table>

      <h3>MSP Traffic Sources</h3>
      <ul>${list(report.topLandingSources)}</ul>

      <h2>Website Overview</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;background:#f7fbff">
        <tr><td>Total visitors</td><td><strong>${report.totalVisitors}</strong></td></tr>
        <tr><td>Total page views</td><td><strong>${report.totalPageViews}</strong></td></tr>
        <tr><td>All form starts / submissions</td><td><strong>${report.totalFormStarts} / ${report.totalFormSubmits}</strong></td></tr>
        <tr><td>Avg. session page time</td><td><strong>${report.avgTimeSeconds}s</strong></td></tr>
        <tr><td>Avg. scroll depth</td><td><strong>${report.avgScrollDepth}%</strong></td></tr>
      </table>

      <h3>Top Pages</h3>
      <ul>${list(report.topPages)}</ul>

      <h3>Most-Clicked CTAs</h3>
      <ul>${list(report.topCtas)}</ul>

      <h3>Exit Indicators</h3>
      <p style="color:#516071">Pages with time-on-page events often represent the last page before a visitor left or navigated away.</p>
      <ul>${list(report.exitIndicators)}</ul>

      <h2>Key Insights</h2>
      <ul>${report.insights.map((insight) => `<li>${escapeHtml(insight)}</li>`).join("")}</ul>

      <h2>Recommended Next Actions</h2>
      <ul>
        <li>Review top CTA wording and reuse the best performer in lower-performing sections.</li>
        <li>Watch form start vs. submission rate before adding more form fields.</li>
        <li>Compare UTM sources weekly so ad spend follows the highest-converting traffic.</li>
      </ul>
    </div>
  `;
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && auth !== `Bearer ${cronSecret}` && new URL(req.url).searchParams.get("secret") !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = weekKey();
  const force = new URL(req.url).searchParams.get("force") === "true";
  const logs = await readReportLog();
  if (!force && logs.some((log) => log.weekKey === key)) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Report already sent for this week", weekKey: key });
  }

  const until = new Date();
  const since = new Date(until.getTime() - 7 * 24 * 60 * 60 * 1000);
  const events = await readAnalyticsEvents({ since, until, limit: 50000 });
  const report = buildReport(events);
  const emailReady = assertEmailReady();
  if (!emailReady.ok) {
    return NextResponse.json({ error: "Email is not configured", missing: emailReady.missing }, { status: 500 });
  }

  const to = process.env.ANALYTICS_REPORT_TO || process.env.SALES_TO || process.env.TICKETS_TO;
  if (!to) {
    return NextResponse.json({ error: "Missing ANALYTICS_REPORT_TO or fallback recipient" }, { status: 500 });
  }

  try {
    await createMailer().sendMail({
      from: emailReady.config.from,
      to,
      subject: `[${SITE.brand}] Weekly website analytics report`,
      html: reportHtml(report, since, until),
      text: [
        `Weekly Website Analytics (${since.toLocaleDateString("en-US")} - ${until.toLocaleDateString("en-US")})`,
        `MSP visitors: ${report.landingVisitors}`,
        `MSP conversion rate: ${report.landingConversionRate}`,
        `MSP form starts/submissions: ${report.landingFormStarts}/${report.landingFormSubmits}`,
        `Total visitors: ${report.totalVisitors}`,
        `Total form submissions: ${report.totalFormSubmits}`,
        "",
        "Insights:",
        ...report.insights.map((insight) => `- ${insight}`),
      ].join("\n"),
    });

    await appendReportLog({ weekKey: key, sentAt: new Date().toISOString(), recipient: to, eventCount: events.length });
    return NextResponse.json({ ok: true, weekKey: key, eventCount: events.length, to });
  } catch {
    return NextResponse.json({ error: "Report email failed to send" }, { status: 502 });
  }
}
