"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SITE } from "@/src/lib/site-config";

export type UserIntentState = "exploring" | "considering" | "ready";

export function useScrollPosition() {
  const [position, setPosition] = useState({ y: 0, depth: 0 });

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      setPosition({ y: window.scrollY, depth });
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return position;
}

export function useUserIntent() {
  const { depth } = useScrollPosition();
  const [secondsOnPage, setSecondsOnPage] = useState(0);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [ctaHovers, setCtaHovers] = useState(0);
  const [ctaClicks, setCtaClicks] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [heroMessageShifted, setHeroMessageShifted] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setSecondsOnPage((value) => value + 5), 5000);
    const heroTimer = window.setTimeout(() => setHeroMessageShifted(true), 26000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(heroTimer);
    };
  }, []);

  useEffect(() => {
    if (hasInteracted) return;
    const nudgeTimer = window.setTimeout(() => setShowNudge(true), 55000);
    return () => window.clearTimeout(nudgeTimer);
  }, [hasInteracted]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target.getAttribute("data-intent-section");
          if (!section) continue;
          setVisibleSections((current) => (current.includes(section) ? current : [...current, section]));
        }
      },
      { threshold: 0.38, rootMargin: "0px 0px -12% 0px" }
    );

    document.querySelectorAll<HTMLElement>("[data-intent-section]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const registerInteraction = useCallback(() => {
    setHasInteracted(true);
    setShowNudge(false);
  }, []);

  const registerCtaHover = useCallback(() => {
    registerInteraction();
    setCtaHovers((value) => value + 1);
  }, [registerInteraction]);

  const registerCtaClick = useCallback(() => {
    registerInteraction();
    setCtaClicks((value) => value + 1);
  }, [registerInteraction]);

  const state: UserIntentState = useMemo(() => {
    const reachedReadySection = visibleSections.some((section) => ["sales-proof", "msp-trust", "msp-faq", "msp-final-form"].includes(section));
    const reachedConsideringSection = visibleSections.some((section) =>
      ["msp-pain", "sales-consequences", "sales-transition", "msp-services"].includes(section)
    );

    if (depth >= 68 || reachedReadySection || ctaClicks > 0) return "ready";
    if (depth >= 26 || secondsOnPage >= 20 || reachedConsideringSection || ctaHovers > 0) return "considering";
    return "exploring";
  }, [ctaClicks, ctaHovers, depth, secondsOnPage, visibleSections]);

  const hasSeen = useCallback((section: string) => visibleSections.includes(section), [visibleSections]);

  return {
    state,
    isReady: state === "ready",
    depth,
    secondsOnPage,
    visibleSections,
    heroMessageShifted,
    showNudge,
    hasSeen,
    registerInteraction,
    registerCtaHover,
    registerCtaClick,
  };
}

export function useDynamicCTA(intentState: UserIntentState) {
  return useMemo(() => {
    if (intentState === "ready") {
      return { label: "Talk to a real technician now", href: SITE.phoneHref };
    }

    if (intentState === "considering") {
      return { label: "Get clarity on what to fix first", href: "#quick-plan" };
    }

    return { label: "See what's slowing your team down", href: "#msp-pain" };
  }, [intentState]);
}
