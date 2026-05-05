"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SITE } from "@/src/lib/site-config";

export type UserIntentStage = "early" | "considering" | "hesitating" | "ready";

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
  const [idleTime, setIdleTime] = useState(0);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [ctaHovers, setCtaHovers] = useState(0);
  const [ctaClicks, setCtaClicks] = useState(0);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);
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
    const resetIdle = () => setIdleTime(0);
    const idleInterval = window.setInterval(() => setIdleTime((value) => value + 5), 5000);

    window.addEventListener("mousemove", resetIdle, { passive: true });
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("scroll", resetIdle, { passive: true });
    window.addEventListener("touchstart", resetIdle, { passive: true });
    window.addEventListener("click", resetIdle);
    return () => {
      window.clearInterval(idleInterval);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("scroll", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
      window.removeEventListener("click", resetIdle);
    };
  }, []);

  useEffect(() => {
    const onMouseOut = (event: MouseEvent) => {
      if (event.clientY <= 0) setExitIntentTriggered(true);
    };

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target.getAttribute("data-intent-section");
          if (!section) continue;
          setActiveSection(section);
          setVisibleSections((current) => (current.includes(section) ? current : [...current, section]));
        }
      },
      { threshold: 0.38, rootMargin: "0px 0px -12% 0px" }
    );

    document.querySelectorAll<HTMLElement>("[data-intent-section]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const registerInteraction = useCallback(() => {
    setIdleTime(0);
  }, []);

  const registerCtaHover = useCallback(() => {
    registerInteraction();
    setCtaHovers((value) => value + 1);
  }, [registerInteraction]);

  const registerCtaClick = useCallback(() => {
    registerInteraction();
    setCtaClicks((value) => value + 1);
  }, [registerInteraction]);

  const stage: UserIntentStage = useMemo(() => {
    const reachedReadySection = visibleSections.some((section) => ["proof", "trust", "faq", "final"].includes(section));
    const reachedConsideringSection = visibleSections.some((section) =>
      ["problems", "cost", "relief", "services"].includes(section)
    );

    if (depth >= 68 || reachedReadySection || ctaClicks > 0) return "ready";
    if (idleTime >= 20 || exitIntentTriggered) return "hesitating";
    if (depth >= 26 || secondsOnPage >= 20 || reachedConsideringSection || ctaHovers > 0) return "considering";
    return "early";
  }, [ctaClicks, ctaHovers, depth, exitIntentTriggered, idleTime, secondsOnPage, visibleSections]);

  const hasSeen = useCallback((section: string) => visibleSections.includes(section), [visibleSections]);

  return {
    stage,
    state: stage,
    isReady: stage === "ready",
    depth,
    scrollDepth: depth,
    secondsOnPage,
    idleTime,
    visibleSections,
    sectionsViewed: visibleSections,
    activeSection,
    exitIntentTriggered,
    heroMessageShifted,
    showHesitationPrompt: idleTime >= 20 || exitIntentTriggered,
    hasSeen,
    registerInteraction,
    registerCtaHover,
    registerCtaClick,
  };
}

export function useDynamicCTA(intent: UserIntentStage | { stage: UserIntentStage }) {
  const stage = typeof intent === "string" ? intent : intent.stage;

  return useMemo(() => {
    if (stage === "ready") {
      return { label: "Talk to a Real Technician", href: SITE.phoneHref };
    }

    if (stage === "hesitating") {
      return { label: "Fix This Before It Gets Worse", href: "#quick-plan" };
    }

    if (stage === "considering") {
      return { label: "See What to Fix First", href: "#quick-plan" };
    }

    return { label: "Get a Quick IT Plan", href: "#quick-plan" };
  }, [stage]);
}
