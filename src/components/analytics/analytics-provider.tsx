"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type TrackInput = {
  eventType: string;
  elementId?: string;
  elementText?: string;
  section?: string;
  metadata?: Record<string, unknown>;
};

function getSessionId() {
  const key = "lsgt_session_id";
  try {
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const next = crypto.randomUUID();
    window.sessionStorage.setItem(key, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

function currentUtm(searchParams: URLSearchParams) {
  return {
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
    utmContent: searchParams.get("utm_content") || undefined,
    utmTerm: searchParams.get("utm_term") || undefined,
  };
}

export function trackAnalyticsEvent(input: TrackInput) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const event = {
    id: crypto.randomUUID(),
    sessionId: getSessionId(),
    eventType: input.eventType,
    pagePath: `${window.location.pathname}${window.location.search}`,
    elementId: input.elementId,
    elementText: input.elementText,
    section: input.section,
    timestamp: new Date().toISOString(),
    metadata: input.metadata,
    ...currentUtm(url.searchParams),
  };

  const body = JSON.stringify(event);
  if (navigator.sendBeacon) {
    const ok = navigator.sendBeacon("/api/analytics/events", new Blob([body], { type: "application/json" }));
    if (ok) return;
  }

  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startRef = useRef<number>(0);
  const maxScrollRef = useRef(0);
  const formStartedRef = useRef(new Set<string>());
  const formImpressedRef = useRef(new Set<string>());

  const routeKey = useMemo(() => `${pathname}?${searchParams.toString()}`, [pathname, searchParams]);

  useEffect(() => {
    startRef.current = Date.now();
    maxScrollRef.current = 0;
    trackAnalyticsEvent({
      eventType: "page_view",
      metadata: {
        referrer: document.referrer || undefined,
        title: document.title,
      },
    });

    function sendTimeOnPage() {
      trackAnalyticsEvent({
        eventType: "time_on_page",
        metadata: {
          durationMs: Date.now() - startRef.current,
          maxScrollDepth: maxScrollRef.current,
        },
      });
    }

    window.addEventListener("pagehide", sendTimeOnPage);
    return () => {
      window.removeEventListener("pagehide", sendTimeOnPage);
      sendTimeOnPage();
    };
  }, [routeKey]);

  useEffect(() => {
    const sentDepths = new Set<number>();

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      maxScrollRef.current = Math.max(maxScrollRef.current, depth);

      for (const marker of [25, 50, 75, 90]) {
        if (depth >= marker && !sentDepths.has(marker)) {
          sentDepths.add(marker);
          trackAnalyticsEvent({ eventType: "scroll_depth", metadata: { depth: marker } });
        }
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [routeKey]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target.getAttribute("data-analytics-section") || entry.target.id;
          if (!section) continue;
          trackAnalyticsEvent({ eventType: "section_view", section });
          sectionObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.45 }
    );

    const formObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const formId = entry.target.getAttribute("data-form-id") || entry.target.id;
          if (!formId || formImpressedRef.current.has(formId)) continue;
          formImpressedRef.current.add(formId);
          trackAnalyticsEvent({
            eventType: "form_impression",
            elementId: formId,
            section: entry.target.getAttribute("data-analytics-section") || undefined,
          });
        }
      },
      { threshold: 0.35 }
    );

    document.querySelectorAll<HTMLElement>("[data-analytics-section]").forEach((section) => sectionObserver.observe(section));
    document.querySelectorAll<HTMLElement>("form[data-form-id]").forEach((form) => formObserver.observe(form));

    function onClick(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-analytics-id],a,button") : null;
      if (!target) return;
      const text = target.getAttribute("data-analytics-text") || target.textContent?.replace(/\s+/g, " ").trim().slice(0, 160);
      trackAnalyticsEvent({
        eventType: "click",
        elementId: target.getAttribute("data-analytics-id") || target.id || undefined,
        elementText: text || undefined,
        section: target.closest<HTMLElement>("[data-analytics-section]")?.getAttribute("data-analytics-section") || undefined,
        metadata: {
          href: target instanceof HTMLAnchorElement ? target.href : undefined,
          tag: target.tagName.toLowerCase(),
        },
      });
    }

    function onInput(e: Event) {
      const form = e.target instanceof Element ? e.target.closest<HTMLFormElement>("form[data-form-id]") : null;
      if (!form) return;
      const formId = form.getAttribute("data-form-id") || form.id;
      if (!formId || formStartedRef.current.has(formId)) return;
      formStartedRef.current.add(formId);
      trackAnalyticsEvent({
        eventType: "form_start",
        elementId: formId,
        section: form.getAttribute("data-analytics-section") || undefined,
      });
    }

    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    return () => {
      sectionObserver.disconnect();
      formObserver.disconnect();
      document.removeEventListener("click", onClick);
      document.removeEventListener("input", onInput);
    };
  }, [routeKey]);

  return null;
}
