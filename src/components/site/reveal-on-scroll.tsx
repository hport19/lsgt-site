"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;
    let rafId: number | null = null;
    let timeoutId: number | null = null;
    let mo: MutationObserver | null = null;

    const applyReveal = () => {
      const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (!targets.length) return false;

      if (prefersReduced || !("IntersectionObserver" in window)) {
        root.classList.remove("reveal-ready");
        for (const el of targets) {
          el.classList.add("is-visible");
        }
        return true;
      }

      root.classList.add("reveal-ready");

      for (const el of targets) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add("is-visible");
        }
      }

      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );

      for (const el of targets) {
        if (el.classList.contains("is-visible")) continue;
        io.observe(el);
      }

      return true;
    };

    // Reset fail-safe state on each route change; content stays visible by default.
    root.classList.remove("reveal-ready");

    if (!applyReveal()) {
      // App Router can mount sections after this effect; retry shortly.
      rafId = window.requestAnimationFrame(() => {
        applyReveal();
      });
      timeoutId = window.setTimeout(() => {
        applyReveal();
      }, 250);
    }

    // Watch for late-mounted sections on route transitions.
    mo = new MutationObserver(() => {
      applyReveal();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo?.disconnect();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
