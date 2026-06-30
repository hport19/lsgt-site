"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/src/components/analytics/analytics-provider";

type TicketType = "support" | "project" | "msp";

type SolutionCard = {
  title: string;
  desc: string;
  bullets: string[];
  image: string;
  ctaType: TicketType;
  ctaLabel: string;
  href?: string;
  quickActions?: { label: string; href: string }[];
};

type PiPDocument = Document & {
  pictureInPictureElement?: Element | null;
  exitPictureInPicture?: () => Promise<void>;
};

type PiPVideo = HTMLVideoElement & {
  webkitEnterPictureInPicture?: () => void;
};

// Bump this when you replace files in /public but the browser/Next image cache still serves old versions.
// IMPORTANT: do NOT append this to <Image src> as a query string (Next/Image will throw unless configured).
const ASSET_VERSION = "2025-12-21-1";

const STATS = [
  { label: "Response SLA", value: "< 1 hr" },
  { label: "Projects Delivered", value: "120+" },
  { label: "Uptime Targets", value: "99.95%" },
  { label: "Markets", value: "TX • OK • NM • KS" },
] as const;

const OUTCOMES = [
  {
    title: "Stop downtime & slow networks",
    desc: "Design-first infrastructure with visibility, segmentation, and clean documentation.",
  },
  {
    title: "Calls and collaboration stay online",
    desc: "Managed VoIP call routing, auto-attendants, and extension management for customer-facing teams.",
  },
  {
    title: "Premium MSP, real humans",
    desc: "Fast support, proactive monitoring, and standards that feel enterprise—without the bloat.",
  },
] as const;

const RESULTS = [
  { label: "Faster issue resolution", value: "Minutes—not days", desc: "Clear ownership, clean tickets, and real humans." },
  { label: "Cleaner infrastructure", value: "Labelled + documented", desc: "Diagrams, handoff notes, and standards you can keep." },
  { label: "Security posture", value: "Hardened by default", desc: "Segmentation, least-privilege access, and audit-ready configs." },
  { label: "Operational uptime", value: "Built for uptime", desc: "Redundancy planning + proactive monitoring options." },
] as const;

function lockMute(e: React.SyntheticEvent<HTMLVideoElement>) {
  const vid = e.currentTarget;
  if (!vid.muted) vid.muted = true;
  if (vid.volume !== 0) vid.volume = 0;
}

function BeforeAfterSlider({
  beforeSrc = "/before.web.mp4",
  afterSrc = "/after.web.mp4",
  label = "Before / After",
}: {
  beforeSrc?: string;
  afterSrc?: string;
  label?: string;
}) {
  const [v, setV] = useState(55);
  const [dragging, setDragging] = useState(false);
  const [pipSide, setPipSide] = useState<"before" | "after" | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const afterVideoRef = useRef<HTMLVideoElement | null>(null);
  const beforeVideoRef = useRef<HTMLVideoElement | null>(null);

  function clamp(n: number) {
    return Math.max(0, Math.min(100, n));
  }

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setV(clamp(pct));
  }, []);

  function onTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    // Click anywhere on the bar/preview updates position
    setFromClientX(e.clientX);
  }

  function onHandlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  }

  function onHandlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    setFromClientX(e.clientX);
  }

  function onHandlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    setDragging(false);
    try {
      (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  async function togglePiP() {
    const video = afterVideoRef.current;
    if (!video) return;
    const doc = document as PiPDocument;
    const pipVideo = video as PiPVideo;
    try {
      if (doc.pictureInPictureElement) {
        await doc.exitPictureInPicture?.();
        return;
      }
      if (video.requestPictureInPicture) {
        await video.requestPictureInPicture();
        return;
      }
      if (pipVideo.webkitEnterPictureInPicture) {
        pipVideo.webkitEnterPictureInPicture();
      }
    } catch {}
  }

  useEffect(() => {
    function tryResume() {
      // If the user just exited PiP or returned to the tab, browsers may pause the element.
      // We try to resume silently.
      const vids = [afterVideoRef.current, beforeVideoRef.current].filter(Boolean) as HTMLVideoElement[];
      for (const vid of vids) {
        // If PiP is active, don't fight the browser.
        // If not, attempt to play.
        if (!document.pictureInPictureElement) {
          try {
            const p = vid.play();
            void p.catch(() => {});
          } catch {}
        }
      }
    }

    function onLeavePiP() {
      // When PiP is closed, force the inline videos to continue.
      window.setTimeout(() => tryResume(), 0);
      window.setTimeout(() => tryResume(), 250);
    }

    function onVisibility() {
      if (document.visibilityState === "visible") {
        window.setTimeout(() => tryResume(), 0);
        window.setTimeout(() => tryResume(), 250);
      }
    }

    // Track which video is currently in Picture-in-Picture so we can show the badge in the right place
    const afterEl = afterVideoRef.current;
    const beforeEl = beforeVideoRef.current;

    function onAfterEnterPiP() {
      setPipSide("after");
    }
    function onBeforeEnterPiP() {
      setPipSide("before");
    }
    function onAnyLeavePiP() {
      setPipSide(null);
    }

    const onAfterEnterPiPListener: EventListener = () => onAfterEnterPiP();
    const onBeforeEnterPiPListener: EventListener = () => onBeforeEnterPiP();
    const onAnyLeavePiPListener: EventListener = () => onAnyLeavePiP();
    const onLeavePiPListener: EventListener = () => onLeavePiP();

    if (afterEl) {
      afterEl.addEventListener("enterpictureinpicture", onAfterEnterPiPListener);
      afterEl.addEventListener("leavepictureinpicture", onAnyLeavePiPListener);
    }
    if (beforeEl) {
      beforeEl.addEventListener("enterpictureinpicture", onBeforeEnterPiPListener);
      beforeEl.addEventListener("leavepictureinpicture", onAnyLeavePiPListener);
    }

    // PiP events
    document.addEventListener("leavepictureinpicture", onLeavePiPListener);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("leavepictureinpicture", onLeavePiPListener);
      document.removeEventListener("visibilitychange", onVisibility);
      if (afterEl) {
        afterEl.removeEventListener("enterpictureinpicture", onAfterEnterPiPListener);
        afterEl.removeEventListener("leavepictureinpicture", onAnyLeavePiPListener);
      }
      if (beforeEl) {
        beforeEl.removeEventListener("enterpictureinpicture", onBeforeEnterPiPListener);
        beforeEl.removeEventListener("leavepictureinpicture", onAnyLeavePiPListener);
      }
    };
  }, []);

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: PointerEvent) {
      setFromClientX(e.clientX);
    }
    function onUp() {
      setDragging(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, setFromClientX]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white/85">{label}</div>
          <div className="mt-1 text-sm text-white/65">Click or drag the handle to compare.</div>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-950/25 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
          {Math.round(v)}%
        </div>
      </div>

      <div className="mt-5" role="group" aria-label="Before and after comparison">
        {/* Mobile/Tablet: slider */}
        <div
          ref={trackRef}
          onClick={onTrackClick}
          onPointerDown={(e) => {
            setDragging(true);
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            setFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!dragging) return;
            setFromClientX(e.clientX);
          }}
          onPointerUp={(e) => {
            setDragging(false);
            try {
              (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
            } catch {}
          }}
          onPointerCancel={() => setDragging(false)}
          className={`relative overflow-hidden rounded-2xl border cursor-pointer transition touch-none lg:hidden
    ${dragging
      ? "border-cyan-300/40 shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_0_60px_rgba(34,211,238,0.25)]"
      : "border-white/10 bg-neutral-950/25"}
  `}
        >
          {/* Vertical media container */}
          <div className="relative mx-auto aspect-[9/16] h-[480px] w-auto max-w-full sm:h-[520px]">
            {/* Base = AFTER */}
            <video
              ref={afterVideoRef}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
            >
              <source src={afterSrc} type="video/mp4" />
            </video>

            {/* Top = BEFORE clipped */}
            <div
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}
              aria-hidden="true"
            >
              <video
                ref={beforeVideoRef}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
              >
                <source src={beforeSrc} type="video/mp4" />
              </video>
            </div>

            {/* Divider + draggable handle */}
            <div className="absolute inset-y-0" style={{ left: `${v}%` }} aria-hidden="true">
              <div
                className={`h-full w-[3px] transition
    ${dragging
      ? "bg-cyan-300 shadow-[0_0_0_1px_rgba(0,0,0,0.55),0_0_40px_rgba(34,211,238,0.65)]"
      : "bg-cyan-200/70 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_0_24px_rgba(34,211,238,0.28)]"}
  `}
              />
            </div>

            <button
              type="button"
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border px-3 py-2 text-xs backdrop-blur transition
  ${dragging
    ? "border-cyan-300/60 bg-cyan-950/45 scale-105 shadow-[0_12px_40px_rgba(34,211,238,0.65),0_0_0_1px_rgba(34,211,238,0.45)]"
    : "border-cyan-200/35 bg-cyan-950/35 shadow-[0_10px_30px_rgba(0,0,0,0.35),0_0_0_1px_rgba(34,211,238,0.18)]"}
  focus:outline-none focus:ring-4 focus:ring-cyan-500/20
`}
              style={{ left: `${v}%` }}
              aria-label="Drag handle"
            >
              ⇆
            </button>

            {/* Labels */}
            <button
              type="button"
              onClick={() => setV(0)}
              className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/75 backdrop-blur hover:bg-black/35"
            >
              Before
            </button>
            <button
              type="button"
              onClick={() => setV(100)}
              className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/75 backdrop-blur hover:bg-black/35"
            >
              After
            </button>
            <button
              type="button"
              onClick={togglePiP}
              className="absolute right-3 top-12 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[0.7rem] text-white/75 backdrop-blur hover:bg-black/35"
            >
              PiP
            </button>
            {pipSide ? (
              <div
                className={`absolute top-20 z-20 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/80 backdrop-blur ${
                  pipSide === "after" ? "right-3" : "left-3"
                }`}
              >
                Playing in Picture-in-Picture
              </div>
            ) : null}

            {/* Soft cyan wash */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45))]" />
          </div>

          <div className="px-4 pb-4 pt-4" onClick={(e) => e.stopPropagation()}>
            <input
              type="range"
              min={0}
              max={100}
              value={v}
              onChange={(e) => setV(Number(e.currentTarget.value))}
              className="w-full accent-cyan-300"
              aria-label="Before after slider"
            />
            <div className="mt-2 text-xs text-white/55">{/* optional note */}</div>
          </div>
        </div>

        {/* Desktop: side-by-side with controls */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="rounded-2xl border border-white/10 bg-neutral-950/25 p-3">
            <div className="mb-2 text-xs text-white/60">Before</div>
            <video
              className="w-full rounded-xl bg-black/40"
              controls
              controlsList="nodownload noplaybackrate noremoteplayback"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedMetadata={lockMute}
              onVolumeChange={lockMute}
            >
              <source src={beforeSrc} type="video/mp4" />
            </video>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-950/25 p-3">
            <div className="mb-2 text-xs text-white/60">After</div>
            <video
              className="w-full rounded-xl bg-black/40"
              controls
              controlsList="nodownload noplaybackrate noremoteplayback"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedMetadata={lockMute}
              onVolumeChange={lockMute}
            >
              <source src={afterSrc} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

const SOLUTIONS: SolutionCard[] = [
  {
    title: "MSP Services (Managed IT)",
    desc: "Managed Foundation core plan plus add-ons for backup, security, and network operations.",
    image: "/media/external/msp-ops-pro.jpg",
    bullets: ["Managed Foundation: $89/user/month", "Minimum 5 users", "Add-ons available by user/device/server", "Core Plan required for all add-ons"],
    ctaType: "msp",
    ctaLabel: "Explore MSP plans",
    href: "/msp",
    quickActions: [
      { label: "Call", href: "tel:8064849040" },
      { label: "Email", href: "mailto:info@lonestarglobaltech.com" },
    ],
  },
  {
    title: "Business Phone Systems (Managed VoIP)",
    desc: "Modern cloud phone systems with call routing, auto attendants, extension management, and ongoing support.",
    image: "/media/external/phone-system.jpg",
    bullets: ["Call flow design", "Auto attendants + IVR", "Extension onboarding", "Carrier coordination (Telnyx)"],
    ctaType: "project",
    ctaLabel: "Schedule a FREE Assessment",
  },
  {
    title: "Network Infrastructure",
    desc: "Secure switching, Wi-Fi design, VLAN segmentation, SD-WAN, and firewall management.",
    image: "/media/external/network-rack.jpg",
    bullets: ["VLAN design", "Wi-Fi planning", "Firewall policies", "Documentation + labeling"],
    ctaType: "project",
    ctaLabel: "Schedule a FREE Assessment",
  },
  {
    title: "Security Cameras & Access",
    desc: "PoE CCTV design, AI event detection, retention planning, and secure remote access.",
    image: "/media/external/security-camera.jpg",
    bullets: ["AI event tuning", "Retention planning", "Secure remote viewing", "Clean cabling"],
    ctaType: "project",
    ctaLabel: "Schedule a FREE Assessment",
  },
  {
    title: "Low-Voltage & Structured Cabling",
    desc: "Commercial CAT6/fiber, racks, patch panels, testing, and code-compliant installs.",
    image: "/media/external/structured-cabling-rack.jpg",
    bullets: ["Rack build-outs", "CAT6 + fiber", "Testing + labeling", "Future-ready scalability"],
    ctaType: "project",
    ctaLabel: "Schedule a FREE Assessment",
  },
];

const PROCESS = [
  { step: "01", title: "Assess", desc: "We map your environment, risks, and priorities (speed, security, uptime, budget)." },
  { step: "02", title: "Design", desc: "We propose a clean architecture with scope, deliverables, and a professional rollout plan." },
  { step: "03", title: "Deploy", desc: "Implementation with labeling, documentation, and validation—no mystery installs." },
  { step: "04", title: "Support", desc: "Ongoing monitoring + fast response with standards that keep your operation stable." },
] as const;

const PROJECTS = [
  {
    name: "ZHX Trucking",
    subtitle: "Yard-wide wireless + AI surveillance modernization",
    images: ["/projects/zhx/1.jpg", "/projects/zhx/2.jpg", "/projects/zhx/3.jpg", "/projects/zhx/4.jpg"],
    highlights: ["PtMP / PtP wireless coverage", "AI CCTV events + retention planning", "Network segmentation + documentation"],
    quote:
      "GlobalTech moved fast, cleaned up our infrastructure, and the coverage is night-and-day better. Everything was documented and delivered professionally.",
    author: "Manuel M",
  },
  {
    name: "Phipps Dental Practice",
    subtitle: "Clinical network reliability + secure operations",
    images: ["/projects/phipps/1.jpg", "/projects/phipps/2.jpg", "/projects/phipps/3.jpg"],
    highlights: ["Secure switching + Wi-Fi tuning", "Workstation + imaging workflow support", "Standards-first cabling + labeling"],
    quote:
      "They were thorough, responsive, and extremely professional. Our systems run smoother and we finally have a clear, secure setup.",
    author: "Dr. Phipps",
  },
  {
    name: "Best Buy",
    subtitle: "On-site IT support with enterprise-grade execution",
    images: ["/projects/bestbuy/1.jpg", "/projects/bestbuy/2.jpg", "/projects/bestbuy/3.jpg"],
    highlights: ["On-site troubleshooting + remediation", "Process-driven diagnostics", "Clear communication + closure notes"],
    quote:
      "Professional, efficient, and easy to work with. The team communicated clearly and executed like an enterprise partner.",
    author: "General Manager, Best Buy Amarillo",
  },
  {
    name: "Barra del Rodeo",
    subtitle: "Security + network build-out for a high-traffic venue",
    images: ["/projects/barra/1.jpg", "/projects/barra/2.jpg", "/projects/barra/3.jpg"],
    highlights: ["CCTV coverage expansion", "Stable Wi-Fi for operations", "Clean install + future-ready layout"],
    quote:
      "Se notó la diferencia desde el primer día. Todo quedó bien instalado, bien explicado, y con un soporte rápido cuando lo necesitamos.",
    author: "Julieta V",
  },
  {
    name: "Hodgetown Stadium",
    subtitle: "Fiber-connected ball tracking camera install",
    images: ["/projects/hodgetown/1.jpg", "/projects/hodgetown/2.jpg", "/projects/hodgetown/3.jpg"],
    highlights: ["Ball-tracking camera integration", "Fiber uplink to network core", "Clean mounting + calibration support"],
    quote:
      "GlobalTech installed our ball-tracking camera with a clean fiber-connected setup. Professional work, great communication, and solid results.",
    author: "Hodgetown Stadium Team",
  },
] as const;

function ProjectCard({
  project,
  onPrimary,
}: {
  project: (typeof PROJECTS)[number];
  onPrimary: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const total = project.images.length;

  function clearAuto() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startAuto() {
    clearAuto();
    intervalRef.current = window.setInterval(() => {
      setIdx((v) => (v + 1) % total);
    }, 3500);
  }

  function goPrev() {
    setIdx((v) => (v - 1 + total) % total);
    startAuto();
  }

  function goNext() {
    setIdx((v) => (v + 1) % total);
    startAuto();
  }

  function goTo(i: number) {
    setIdx(() => i);
    startAuto();
  }

  function openLightbox(i: number) {
    setLightboxIdx(i);
    setIdx(i);
    setLightboxOpen(true);
  }

  function goPrevLightbox() {
    setLightboxIdx((v) => {
      const next = (v - 1 + total) % total;
      setIdx(next);
      return next;
    });
  }

  function goNextLightbox() {
    setLightboxIdx((v) => {
      const next = (v + 1) % total;
      setIdx(next);
      return next;
    });
  }

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent, mode: "inline" | "lightbox") {
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      if (mode === "lightbox") {
        goNextLightbox();
      } else {
        goNext();
      }
    } else {
      if (mode === "lightbox") {
        goPrevLightbox();
      } else {
        goPrev();
      }
    }
  }

  useEffect(() => {
    if (total <= 1) return;
    startAuto();
    return () => clearAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <div className="group grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-transparent backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.55))]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_55%)] opacity-70" />

        {/* Keep the box consistent; mobile uses 4/3, desktop uses your 1152x1120 ratio */}
        <div
          className="relative aspect-[4/3] w-full sm:aspect-[1152/1120]"
          onTouchStart={onTouchStart}
          onTouchEnd={(e) => onTouchEnd(e, "inline")}
        >
          <Image
            key={`${project.name}-${idx}-${ASSET_VERSION}`}
            src={project.images[idx]}
            alt={`${project.name} project image`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 520px, 560px"
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="object-cover object-center opacity-95 transition duration-500"
            priority={false}
          />
          <button
            type="button"
            onClick={() => openLightbox(idx)}
            className="absolute inset-0 md:hidden"
            aria-label="Open image"
          />

          {/* Arrow controls */}
          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-white/85 backdrop-blur transition hover:bg-black/45 hover:border-white/25 focus:outline-none focus:ring-4 focus:ring-cyan-500/15"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-white/85 backdrop-blur transition hover:bg-black/45 hover:border-white/25 focus:outline-none focus:ring-4 focus:ring-cyan-500/15"
              >
                ›
              </button>
            </>
          ) : null}

          {/* Dots */}
          {total > 1 ? (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/75 backdrop-blur">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    i === idx ? "bg-cyan-400" : "bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Bar moved BELOW image and made glassy */}
        {total > 1 ? (
          <div className="px-4 pb-4">
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_12px_40px_rgba(0,0,0,0.35)]">
              <span className="font-semibold">{project.name}</span>
              <span className="text-white/60">
                {idx + 1}/{total}
              </span>
            </div>
          </div>
        ) : null}

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/75 backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Delivered
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-lg font-semibold">{project.name}</div>
        <div className="mt-1 text-sm text-white/65">{project.subtitle}</div>

        <ul className="mt-4 grid gap-2 text-sm text-white/75">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
          <div className="text-sm text-white/75">“{project.quote}”</div>
          <div className="mt-2 text-xs font-semibold text-white/70">— {project.author}</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPrimary}
            className="inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-white/90"
          >
            Start a request
          </button>
          <div className="text-xs text-white/55">Want a similar outcome? Tell us your scope and timeline.</div>
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={(e) => onTouchEnd(e, "lightbox")}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white/85"
            aria-label="Close image"
          >
            ✕
          </button>
          <div className="flex h-full w-full items-center justify-center px-4">
            <div className="relative h-[78vh] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <Image
                key={`${project.name}-lightbox-${lightboxIdx}-${ASSET_VERSION}`}
                src={project.images[lightboxIdx]}
                alt={`${project.name} project image enlarged`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const PARTNERS = [
  { name: "Microsoft", src: "/Microsoft-Logo.png" },
  { name: "Ubiquiti", src: "/ubiquiti.png" },
  { name: "Grandstream", src: "/grandstream.png" },
  { name: "Cisco", src: "/cisco.png" },
  { name: "Fortinet", src: "/fortinet.png" },
  { name: "Palo Alto Networks", src: "/paloalto.png" },
  { name: "Lenovo", src: "/lenovo.png" },
  { name: "Dell", src: "/dell.png" },
  { name: "HP", src: "/hp.png" },
  { name: "Aruba", src: "/aruba.png" },
  { name: "Axis", src: "/axis.png" },
  { name: "Hanwha", src: "/hanwha.png" },
] as const;

function PartnerLogo({ name, src }: { name: string; src: string }) {
  return (
    <div
      className="mx-3 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/15 px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition duration-300 hover:-translate-y-[2px] hover:border-white/25 hover:bg-white/20 hover:shadow-[0_22px_70px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.12)]"
      title={name}
    >
      <div className="relative h-6 w-[120px] md:w-[140px]">
        <Image
          key={`${src}-${ASSET_VERSION}`}
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 120px, 140px"
          className="object-contain opacity-90 hover:opacity-100 transition"
        />
      </div>
    </div>
  );
}

const CAPABILITY_CARDS = [
  {
    title: "One partner. Real outcomes.",
    desc: "We align strategy + implementation so your IT stack gets simpler, faster, and safer — with documentation you can actually use.",
  },
  {
    title: "Procurement + projects — handled.",
    desc: "Hardware, licensing, installs, managed phone systems, and support with a single accountable team.",
  },
  {
    title: "Premium MSP that’s proactive.",
    desc: "Monitoring, patching, backups, and fast humans — no runaround.",
  },
] as const;

const TRUST_INDUSTRIES = [
  "Healthcare",
  "Logistics",
  "Retail",
  "Enterprise Facilities",
  "Stadiums",
  "Construction",
  "Restaurants",
  "Manufacturing",
  "Energy",
] as const;

const inputClass =
  "w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-white/90 outline-none placeholder:text-white/35 transition duration-300 ease-out focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-500/15 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.55),0_12px_40px_rgba(34,211,238,0.18)]";

const NAME_MAX = 60;
const PHONE_MAX = 20;
const MESSAGE_MAX = 1200;

export default function Page() {
  const [ticketType, setTicketType] = useState<TicketType>("support");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [nameLen, setNameLen] = useState(0);
  const [phoneLen, setPhoneLen] = useState(0);
  const [messageLen, setMessageLen] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Accordion state for Projects
  const [openProject, setOpenProject] = useState<string | null>(null);
  function toggleProject(name: string) {
    setOpenProject((cur) => (cur === name ? null : name));
  }

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  function focusTicketForm(options: { preventScroll?: boolean } = {}) {
    const focusOpts = { preventScroll: options.preventScroll ?? true } as FocusOptions;
    if (nameInputRef.current) {
      nameInputRef.current.focus(focusOpts);
      return;
    }
    const el = document.querySelector<HTMLInputElement>('input[name="name"]');
    el?.focus(focusOpts);
  }

  function scrollToTicketInput() {
    const input = nameInputRef.current ?? document.querySelector<HTMLInputElement>('input[name="name"]');
    if (!input) {
      scrollToId("contact");
      return;
    }
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function goToTicketForm(type?: TicketType) {
    if (type === "msp") {
      window.location.assign("/sales");
      return;
    }
    if (type) {
      setTicketType(type);
    }
    scrollToTicketInput();
    // Focus immediately to keep the mobile keyboard behavior tied to the tap.
    focusTicketForm({ preventScroll: true });
    window.setTimeout(() => focusTicketForm(), 300);
  }

  function goTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // video-first hero media (falls back if missing)
  const [heroMediaMode, setHeroMediaMode] = useState<"video" | "image">("video");

  function onRequestTypeChange(type: TicketType) {
    if (type === "msp") {
      window.location.assign("/msp");
      return;
    }
    setTicketType(type);
  }

  const ticketLabel = useMemo(() => {
    if (ticketType === "msp") return "MSP Services";
    if (ticketType === "project") return "New Project";
    return "Support";
  }, [ticketType]);

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 84;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOkMsg(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const payload = {
      type: ticketType,
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      origin: typeof window !== "undefined" ? window.location.origin : "",
      website: String(fd.get("website") || "").trim(), // honeypot
      turnstileToken: String(fd.get("cf-turnstile-response") || "").trim(),
    };

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { error?: string } = {};
      try {
        data = (await res.json()) as { error?: string };
      } catch {}

      if (!res.ok) {
        const msg = data?.error || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      trackAnalyticsEvent({
        eventType: "form_submit",
        elementId: "home-main-contact-form",
        section: "home-contact",
        metadata: { type: ticketType },
      });
      setOkMsg("Request received. Redirecting…");
      window.location.assign(`/thank-you?type=${encodeURIComponent(ticketType)}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen text-neutral-100">
      {/* Premium Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1300px_760px_at_14%_8%,rgba(59,130,246,0.24),rgba(59,130,246,0.14)_34%,rgba(59,130,246,0.05)_62%,transparent_82%),radial-gradient(1100px_700px_at_86%_18%,rgba(56,189,248,0.2),rgba(56,189,248,0.1)_34%,rgba(56,189,248,0.03)_60%,transparent_80%),linear-gradient(160deg,rgba(2,10,26,0.94),rgba(2,8,23,0.98)_58%,rgba(1,7,18,1)_100%)]" />
        <div className="absolute inset-0 lsgt-grid opacity-[0.13]" />

        <div className="absolute -top-40 left-[-10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.44),transparent_60%)] blur-3xl lsgt-float" />
        <div className="absolute top-[6%] right-[-15%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.34),transparent_64%)] blur-3xl lsgt-float2" />
        <div className="absolute bottom-[-35%] left-[26%] h-[920px] w-[920px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.22),transparent_64%)] blur-3xl lsgt-float3" />

        {/* subtle grain keeps it premium */}
        <div className="absolute inset-0 lsgt-grain opacity-[0.16]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/55 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 lg:max-w-[92rem] lg:py-4">
            <div className="ui-nav-shell flex items-center justify-between gap-3 rounded-2xl px-3 py-2 lg:px-5 lg:py-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileNavOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/80 hover:bg-white/5 lg:hidden"
                aria-label="Toggle navigation"
                aria-expanded={mobileNavOpen}
              >
                <span className="text-lg">{mobileNavOpen ? "×" : "≡"}</span>
              </button>
              <button
                type="button"
                onClick={goTop}
                className="flex items-center gap-3 text-left focus:outline-none"
                aria-label="Go to top"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5 lg:h-9 lg:w-9">
                  <Image src="/isotipo.png" alt="GlobalTech" fill className="object-contain p-0 md:p-1" priority />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold tracking-tight">GlobalTech</div>
                  <div className="hidden text-xs text-white/60 xl:block">
                    DBA of Lone Star GlobalTech • Premium MSP • Security • Infrastructure
                  </div>
                </div>
              </button>
            </div>

            <nav className="hidden items-center gap-2 text-sm text-white/70 lg:flex xl:gap-3">
              <NavBtn onClick={() => window.location.assign("/msp")}>Managed IT</NavBtn>
              <NavBtn onClick={() => scrollToId("solutions")}>Solutions</NavBtn>
              <NavBtn onClick={() => scrollToId("why")}>Why GlobalTech</NavBtn>
              <NavBtn onClick={() => scrollToId("projects")}>Projects</NavBtn>
              <NavBtn onClick={() => window.location.assign("/careers")}>Careers</NavBtn>
              <NavBtn onClick={() => scrollToId("contact")}>Contact</NavBtn>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToTicketForm("msp")}
                className="inline-flex rounded-xl border border-cyan-300/35 bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_12px_34px_rgba(34,211,238,0.22)] hover:bg-cyan-400 lg:px-6 lg:py-2.5 lg:text-sm"
              >
                Get a Quick IT Plan
              </button>
              <button
                type="button"
                onClick={() => (window.location.assign("tel:8064849040"))}
                className="inline-flex rounded-xl border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/92 hover:bg-white/10 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                Call
              </button>
              <button
                type="button"
                onClick={() => (window.location.assign("mailto:info@lonestarglobaltech.com"))}
                className="inline-flex rounded-xl border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/92 hover:bg-white/10 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                Email
              </button>
            </div>
          </div>
          </div>

          <div
            className={`lg:hidden overflow-hidden border-t border-white/10 px-4 transition-all duration-300 ${
              mobileNavOpen ? "max-h-64 py-3 opacity-100" : "max-h-0 py-0 opacity-0"
            }`}
          >
            <div className="grid gap-2 text-sm text-white/80">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  goToTicketForm("msp");
                }}
                className="rounded-xl border border-cyan-300/35 bg-cyan-500 px-4 py-2 text-left font-semibold text-white"
              >
                Schedule a FREE Assessment
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  window.location.assign("/msp");
                }}
                className="rounded-xl border border-white/10 px-4 py-2 text-left hover:bg-white/5"
              >
                MSP Plans
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  scrollToId("solutions");
                }}
                className="rounded-xl border border-white/10 px-4 py-2 text-left hover:bg-white/5"
              >
                Solutions
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  scrollToId("why");
                }}
                className="rounded-xl border border-white/10 px-4 py-2 text-left hover:bg-white/5"
              >
                Why GlobalTech
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  scrollToId("projects");
                }}
                className="rounded-xl border border-white/10 px-4 py-2 text-left hover:bg-white/5"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  window.location.assign("/careers");
                }}
                className="rounded-xl border border-white/10 px-4 py-2 text-left hover:bg-white/5"
              >
                Careers
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  scrollToId("contact");
                }}
                className="rounded-xl border border-white/10 px-4 py-2 text-left hover:bg-white/5"
              >
                Contact
              </button>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    window.location.assign("tel:8064849040");
                  }}
                  className="rounded-xl border border-white/15 bg-white/6 px-4 py-2 text-left font-semibold text-white/90"
                >
                  Call
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    window.location.assign("mailto:info@lonestarglobaltech.com");
                  }}
                  className="rounded-xl border border-white/15 bg-white/6 px-4 py-2 text-left font-semibold text-white/90"
                >
                  Email
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden min-h-[70vh] md:min-h-[80vh]">
          {/* Full-bleed hero media background */}
          <div className="absolute inset-0 -z-10 max-h-[90vh] overflow-hidden">
            {heroMediaMode === "video" ? (
              <video
                className="h-full w-full object-cover object-center"
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
                onError={() => setHeroMediaMode("image")}
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
            ) : <Image src="/media/external/msp-ops-pro.jpg" alt="Managed IT operations team and monitoring systems" fill className="object-cover" priority />}

            {/* Overlays for readability + brand vibe */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.70))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.18),transparent_42%),radial-gradient(circle_at_78%_22%,rgba(56,189,248,0.12),transparent_48%)]" />
          </div>

          {/* Content */}
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
              {/* Glass content panel */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] md:p-8 md:h-full">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
                    <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
                    Enterprise-grade standards for real-world operations
                  </div>

                  {/* ✅ Small business friendly badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-white/80 backdrop-blur">
                    <span className="inline-block h-2 w-2 rounded-full bg-cyan-300" />
                    Small business friendly — we scale to your budget
                  </div>
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-[0.015em] md:text-5xl">
                  Premium IT that feels <span className="text-white">enterprise</span>—built for speed, security, and uptime.
                </h1>

                <p className="mt-4 max-w-xl leading-relaxed text-white/75">
                  We design, deploy, and support networks, cybersecurity, cameras, and MSP services with clean documentation, labeling,
                  and accountability—so your business runs smooth. <span className="text-white/85 font-medium">Big or small, we’ve got you.</span>
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => goToTicketForm("msp")}
                    className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-white transition duration-300 ease-out hover:bg-cyan-400 hover:shadow-[0_12px_40px_rgba(34,211,238,0.25),0_0_0_1px_rgba(34,211,238,0.35)]"
                  >
                    Schedule a FREE Assessment
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.assign("tel:8064849040")}
                    className="rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white/90 hover:bg-white/5"
                  >
                    Call
                  </button>
                  <button
                    type="button"
                    onClick={() => (window.location.assign("mailto:info@lonestarglobaltech.com"))}
                    className="rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white/90 hover:bg-white/5"
                  >
                    Email
                  </button>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_30px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(34,211,238,0.12)]">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/55">
                    Trusted by operations that can’t afford downtime
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {TRUST_INDUSTRIES.map((label) => (
                      <div
                        key={label}
                        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 transition duration-300 hover:-translate-y-[2px] hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_22px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(34,211,238,0.18),0_20px_60px_rgba(34,211,238,0.18)]"
                      >
                        <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8),0_0_16px_rgba(56,189,248,0.45)] transition duration-300 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.95),0_0_24px_rgba(56,189,248,0.7)]" />
                        <span className="text-sm text-white/75 transition duration-300 group-hover:text-white/90">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right-side quick panel */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.55)] md:h-full md:flex md:flex-col md:gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white/85">Documentation-first delivery.</div>
                    <div className="mt-1 text-sm text-white/65">Clean installs + premium support your team can trust.</div>
                  </div>
                  <button
                    type="button"
                    onClick={goTop}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/70 backdrop-blur hover:bg-black/35 focus:outline-none focus:ring-4 focus:ring-cyan-500/15"
                    aria-label="Go to top"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    GlobalTech
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-950/25 p-5 md:mt-0">
                  <div className="text-sm font-semibold text-white/85">Want a rollout plan?</div>
                  <div className="mt-2 text-sm text-white/65">
                    Tell us your scope + timeline. We’ll reply with next steps and a clean estimate path.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => goToTicketForm("project")}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                    >
                      Schedule a FREE Assessment
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToId("projects")}
                      className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/5"
                    >
                      See delivered projects
                    </button>
                  </div>

                  {/* ✅ Small business reassurance */}
                  <div className="mt-4 text-xs text-white/55">
                    Not an enterprise? No problem — we support small businesses and growing teams too.
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:mt-0">
                  {OUTCOMES.map((o) => (
                    <div
                      key={o.title}
                      className="rounded-2xl border border-white/10 bg-neutral-950/25 p-4 transition duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_20px_60px_rgba(34,211,238,0.12)]"
                    >
                      <div className="font-semibold">{o.title}</div>
                      <div className="mt-1 text-sm text-white/70">{o.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 md:mt-0">
                  {STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_30px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(34,211,238,0.16),0_22px_70px_rgba(34,211,238,0.12)]"
                    >
                      <div className="text-2xl font-semibold">{s.value}</div>
                      <div className="mt-1 text-xs text-white/60">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 md:mt-0">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-semibold text-white/60">Markets</div>
                    <div className="mt-1 text-sm text-white/80">Texas • Oklahoma • New Mexico • Kansas</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-semibold text-white/60">Specialties</div>
                    <div className="mt-1 text-sm text-white/80">MSP • VoIP • Security • Infrastructure</div>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/25 bg-emerald-950/20 p-4">
                    <div className="text-xs font-semibold text-emerald-100/80">Texas DPS Private Security License</div>
                    <div className="mt-1 text-sm text-white/80">Security-related services backed by a higher standard of accountability.</div>
                    <div className="mt-2 text-xs font-semibold text-emerald-100/70">License: B30867701</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col">
        {/* Results / Proof */}
        <section data-reveal className="order-10 mx-auto max-w-6xl px-4 pb-6">
          <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.28em] text-white/60">Core MSP Value</div>
                <h2 className="mt-1 text-2xl font-semibold tracking-[0.02em] md:text-3xl">Managed IT built for uptime and accountability.</h2>
                <p className="mt-2 max-w-2xl text-white/70">
                  Premium execution isn’t just equipment — it’s documentation, standards, and follow-through your operation can rely on.
                </p>
              </div>

              <button
                type="button"
                onClick={() => goToTicketForm("project")}
                className="inline-flex w-fit rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90"
              >
                Schedule a FREE Assessment
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {RESULTS.map((r) => (
                <div
                  key={r.label}
                  className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-5 transition duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.09] hover:shadow-[0_28px_85px_rgba(0,0,0,0.55),0_20px_60px_rgba(34,211,238,0.14)]"
                >
                  <div className="text-xs font-semibold text-white/60">{r.label}</div>
                  <div className="mt-2 text-lg font-semibold text-white/90">{r.value}</div>
                  <div className="mt-2 text-sm text-white/70">{r.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/20 p-5 backdrop-blur-xl">
              <div className="text-sm text-white/75">
                “We don’t do mystery installs. We deliver a clean build, labeled, documented, and stable — so your team can run.”
              </div>
              <div className="mt-2 text-xs font-semibold text-white/65">— GlobalTech delivery standard</div>
            </div>
          </div>
        </section>

        {/* Partner band */}
        <section id="why" data-reveal className="order-40 mx-auto max-w-6xl px-4 pb-6 scroll-mt-28 md:scroll-mt-32">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.28em] text-white/60">Why GlobalTech</div>
                <div className="mt-1 text-sm text-white/60">
                  Trusted vendors + certified delivery — unified under one accountable team.
                </div>
              </div>
              <button
                type="button"
                onClick={() => (window.location.assign("/msp"))}
                className="inline-flex w-fit rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/5"
              >
                Schedule a FREE Assessment
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/35">
              <div className="lsgt-marquee">
                <div className="lsgt-marquee__track">
                  {[...PARTNERS, ...PARTNERS].map((p, idx) => (
                    <PartnerLogo key={`${p.name}-${idx}`} name={p.name} src={p.src} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {CAPABILITY_CARDS.map((c) => (
                <div
                  key={c.title}
                  className="rounded-3xl border border-white/10 bg-neutral-950/35 p-5 transition duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_28px_85px_rgba(0,0,0,0.55),0_20px_60px_rgba(34,211,238,0.12)]"
                >
                  <div className="text-lg font-medium tracking-[0.01em]">{c.title}</div>
                  <div className="mt-2 text-sm text-white/65">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" data-reveal className="order-50 mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-[0.02em] md:text-3xl">Delivered projects</h2>
              <p className="mt-2 max-w-2xl text-white/65">
                A few real-world deployments that show how we execute: clean installs, documentation, and enterprise-grade standards.
              </p>
            </div>

            <button
              type="button"
              onClick={() => goToTicketForm("project")}
              className="inline-flex w-fit rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Schedule a FREE Assessment
            </button>
          </div>

          <div className="mt-6">
            <BeforeAfterSlider label="Cabling & infrastructure — cleaned up" />
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="text-sm font-semibold text-white/85">Roof Spotters — before & after</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                <Image src="/roof-before.jpg" alt="Roof Spotters before" fill className="object-contain" sizes="(max-width: 640px) 100vw, 50vw" />
                <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-white/75 backdrop-blur">
                  Before
                </span>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                <Image src="/roof-after.jpg" alt="Roof Spotters after" fill className="object-contain" sizes="(max-width: 640px) 100vw, 50vw" />
                <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-white/75 backdrop-blur">
                  After
                </span>
              </div>
            </div>
          </div>

          {/* Accordion list */}
          <div className="mt-8 grid gap-4">
            {PROJECTS.map((p) => {
              const isOpen = openProject === p.name;
              const panelId = `proj-${p.name.replace(/\s+/g, "-").toLowerCase()}`;

              return (
                <div
                  key={p.name}
                  className="rounded-3xl border border-white/10 bg-white/6 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_25px_80px_rgba(0,0,0,0.40),0_18px_55px_rgba(34,211,238,0.08)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleProject(p.name)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-4 focus:ring-cyan-500/15"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="relative hidden h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/25 sm:block">
                        <Image
                          key={`${p.images[0]}-${ASSET_VERSION}`}
                          src={p.images[0]}
                          alt={`${p.name} thumbnail`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-base font-semibold text-white/90">{p.name}</div>
                          <span className="hidden rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[11px] text-white/70 backdrop-blur sm:inline-flex">
                            {p.images.length} photo{Number(p.images.length) === 1 ? "" : "s"}
                          </span>
                        </div>

                        <div className="mt-1 line-clamp-1 text-sm text-white/60">{p.subtitle}</div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.highlights.slice(0, 3).map((h) => (
                            <span
                              key={h}
                              className="inline-flex items-center rounded-full border border-white/10 bg-neutral-950/25 px-2.5 py-1 text-[12px] text-white/70"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-xs text-white/55 md:inline">{isOpen ? "Hide details" : "View details"}</span>
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white/70 transition duration-300 ${
                          isOpen ? "rotate-180 border-white/20 bg-white/10 text-white/85" : "hover:border-white/20 hover:bg-white/10"
                        }`}
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </div>
                  </button>

                  {/* Summary (shows when collapsed) */}
                  <div className={`px-5 pb-5 ${isOpen ? "hidden" : "block"}`}>
                    <div className="rounded-2xl border border-white/10 bg-neutral-950/25 p-4">
                      <div className="text-sm text-white/70">“{p.quote}”</div>
                      <div className="mt-2 text-xs font-semibold text-white/65">— {p.author}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div
                    id={panelId}
                    className={`border-t border-white/10 px-5 pb-6 pt-5 overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                      isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <ProjectCard
                      project={p}
                      onPrimary={() => {
                        goToTicketForm("project");
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" data-reveal className="order-20 mx-auto max-w-6xl px-4 py-16 scroll-mt-28 md:scroll-mt-32">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-[0.02em] md:text-3xl">Core Services: MSP, VoIP, Infrastructure + Security</h2>
              <p className="mt-2 max-w-2xl text-white/65">
                Built for commercial environments—code-compliant installs with clean documentation and future scalability.
                <span className="block mt-2 text-white/70">
                  Small business? Perfect — we’ll right-size the plan and still deliver premium standards.
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToTicketForm("project")}
              className="inline-flex w-fit rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Schedule a FREE Assessment
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <article
                key={s.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_30px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(34,211,238,0.14),0_22px_70px_rgba(34,211,238,0.10)]"
              >
                <div className="relative mb-5 aspect-[16/8] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <Image src={s.image} alt={`${s.title} visual`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,23,0.65),rgba(2,6,23,0.05))]" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium tracking-[0.01em]">{s.title}</div>
                    <p className="mt-2 text-white/65">{s.desc}</p>
                  </div>
                  <div className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 md:flex">
                    ⇢
                  </div>
                </div>

                <ul className="mt-4 grid gap-2 text-sm text-white/75 sm:grid-cols-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {s.href ? (
                    <a
                      href={s.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                    >
                      {s.ctaLabel}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goToTicketForm(s.ctaType)}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                    >
                      {s.ctaLabel}
                    </button>
                  )}

                  {s.quickActions?.map((action) => (
                    <a
                      key={action.href}
                      href={action.href}
                      className="inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/5"
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right-sized plans */}
        <section data-reveal className="order-30 mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.30)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
              <h2 className="text-2xl font-semibold tracking-[0.02em] md:text-3xl">Small business friendly. Enterprise standards.</h2>
                <p className="mt-2 max-w-2xl text-white/65">
                  We right-size the plan to your budget without compromising the fundamentals: security, documentation, and clean execution.
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.location.assign("/msp")}
                className="inline-flex w-fit rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90"
              >
                Schedule a FREE Assessment
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-neutral-950/35 p-6">
                <div className="text-xs font-semibold text-white/60">Small business</div>
                <div className="mt-2 text-lg font-medium tracking-[0.01em]">Stabilize + secure</div>
                <div className="mt-2 text-sm text-white/65">
                  Fix slow Wi‑Fi, patching gaps, and backups. Clean baseline with fast humans.
                </div>
                <div className="mt-4 text-xs text-white/55">Ideal for 5–25 users</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-950/35 p-6">
                <div className="text-xs font-semibold text-white/60">Growing teams</div>
                <div className="mt-2 text-lg font-medium tracking-[0.01em]">Standardize + scale</div>
                <div className="mt-2 text-sm text-white/65">
                  Policies, device management, security hardening, and predictable support.
                </div>
                <div className="mt-4 text-xs text-white/55">Ideal for 25–100 users</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-950/35 p-6">
                <div className="text-xs font-semibold text-white/60">Multi-site / regulated</div>
                <div className="mt-2 text-lg font-medium tracking-[0.01em]">Harden + audit</div>
                <div className="mt-2 text-sm text-white/65">
                  Segmentation, least-privilege access, documentation, and security-first operations.
                </div>
                <div className="mt-4 text-xs text-white/55">Ideal for multi-location</div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/20 p-5 backdrop-blur-xl">
              <div className="text-sm text-white/75">
                Transparent scope. Clear deliverables. No surprise invoices.
              </div>
              <div className="mt-2 text-xs font-semibold text-white/65">— GlobalTech approach</div>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section id="process" data-reveal className="order-60 border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-semibold tracking-[0.02em] md:text-3xl">How we deliver premium outcomes</h2>
            <p className="mt-2 max-w-2xl text-white/65">Standards, documentation, and execution. No chaos. No mystery installs.</p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {PROCESS.map((p) => (
                <div
                  key={p.step}
                  className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6 transition duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_28px_85px_rgba(0,0,0,0.55),0_20px_60px_rgba(34,211,238,0.12)]"
                >
                  <div className="text-xs font-semibold text-white/60">{p.step}</div>
                  <div className="mt-2 text-lg font-medium tracking-[0.01em]">{p.title}</div>
                  <div className="mt-2 text-sm text-white/65">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" data-reveal className="order-70 mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-stretch">
            {/* Lead magnet strip */}
            <div className="md:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.30)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white/85">FREE Assessment Call</div>
                    <div className="mt-1 text-sm text-white/70">
                      Tell us what you’re trying to fix (or build). We’ll suggest the fastest path: MSP, phone systems, project, or support.
                      <span className="block mt-2 text-white/65">
                        New or small business? You’re welcome here — we’ll keep it simple and right-sized.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="tel:8064849040"
                      className="inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90"
                      aria-label="Call GlobalTech"
                    >
                      Call
                    </a>
                    <button
                      type="button"
                      onClick={() => (window.location.assign("mailto:info@lonestarglobaltech.com"))}
                      className="inline-flex rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
                    >
                      Email
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-white/55">{/* Optional scheduling link later */}</div>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold tracking-[0.02em] md:text-3xl">Schedule your FREE Assessment</h2>
              <p className="mt-2 leading-relaxed text-white/65">Tell us what you need. We’ll respond with next steps and a clear plan.</p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_25px_80px_rgba(0,0,0,0.45),0_18px_55px_rgba(34,211,238,0.08)]">
                <div className="text-sm text-white/70">Request type</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <TypeButton active={ticketType === "support"} onClick={() => onRequestTypeChange("support")}>
                    Support
                  </TypeButton>
                  <TypeButton active={ticketType === "project"} onClick={() => onRequestTypeChange("project")}>
                    New project
                  </TypeButton>
                  <TypeButton active={ticketType === "msp"} onClick={() => onRequestTypeChange("msp")}>
                    MSP Services
                  </TypeButton>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-950/30 p-4 text-sm text-white/70">
                  <div className="font-semibold text-white/85">
                    {ticketType === "support" ? "For urgent outages" : ticketType === "msp" ? "For MSP onboarding" : "For project planning"}
                  </div>
                  <div className="mt-1">
                    {ticketType === "support"
                      ? "Include site address + best callback number. We’ll move fast."
                      : ticketType === "msp"
                      ? "Tell us number of users/devices + locations. We’ll reply with a clean MSP plan."
                      : "Share scope + timeline. We’ll reply with a clear rollout plan."}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_18px_55px_rgba(34,211,238,0.08)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-white/55">Direct contact</div>
                    <div className="mt-1 text-xs text-white/50">Call our IVR or use the form for fastest routing.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToTicketForm()}
                    className="inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/5"
                  >
                    Fill the form
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">Phone</span>
                    <a
                      href="tel:8064849040"
                      className="font-semibold text-white/85 hover:text-white"
                      aria-label="Call GlobalTech at 806-484-9040"
                    >
                      (806) 484-9040
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">General</span>
                    <a
                      href="mailto:info@lonestarglobaltech.com"
                      className="font-semibold text-white/85 hover:text-white"
                      aria-label="Email info@lonestarglobaltech.com"
                    >
                      info@lonestarglobaltech.com
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">Support</span>
                    <a
                      href="mailto:support@lonestarglobaltech.com"
                      className="font-semibold text-white/85 hover:text-white"
                      aria-label="Email support@lonestarglobaltech.com"
                    >
                      support@lonestarglobaltech.com
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">Sales / Projects</span>
                    <a
                      href="mailto:sales@lonestarglobaltech.com"
                      className="font-semibold text-white/85 hover:text-white"
                      aria-label="Email sales@lonestarglobaltech.com"
                    >
                      sales@lonestarglobaltech.com
                    </a>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                  <div className="font-semibold text-white/85">
                    {ticketType === "support" ? "Need support right now?" : ticketType === "msp" ? "Request MSP onboarding" : "Planning a new project?"}
                  </div>

                  <div className="mt-1 text-white/65">
                    {ticketType === "support"
                      ? "Fill the form with your site address + best callback number. We’ll respond quickly with next steps."
                      : ticketType === "msp"
                      ? "Fill the form with # of users/devices + locations. We’ll reply with a clean MSP plan and onboarding steps."
                      : "Fill the form with scope + timeline. We’ll follow up with a clear estimate and rollout plan."}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (ticketType === "msp") {
                          window.location.assign("/msp");
                          return;
                        }
                        goToTicketForm(ticketType);
                      }}
                      className="inline-flex rounded-xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-white/90"
                    >
                      {ticketType === "msp" ? "View MSP Plans" : "Schedule a FREE Assessment"}
                    </button>

                    <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                      Typical response: <span className="ml-1 font-semibold text-white/80">&lt; 1 hr</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-white/55">
                  Hours: <span className="text-white/75">Mon–Fri</span> • After-hours available for managed clients
                </div>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              data-form-id="home-main-contact-form"
              data-analytics-section="home-contact"
              className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_30px_90px_rgba(0,0,0,0.55),0_22px_70px_rgba(34,211,238,0.10)]"
            >
              <input name="website" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      ref={nameInputRef}
                      name="name"
                      required
                      className={inputClass}
                      placeholder="Your name"
                      maxLength={NAME_MAX}
                      autoComplete="name"
                      onChange={(e) => setNameLen(e.currentTarget.value.length)}
                    />
                    <div className="text-xs text-white/45 min-h-[1rem]">{nameLen}/{NAME_MAX}</div>
                  </Field>
                  <Field label="Email">
                    <input name="email" type="email" required className={inputClass} placeholder="you@company.com" />
                    <div className="text-xs text-white/45 min-h-[1rem]" aria-hidden="true" />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone">
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className={inputClass}
                      placeholder="(806) 555-1234"
                      maxLength={PHONE_MAX}
                      pattern="^\\+?1?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$"
                      title="Use a valid US phone format, e.g., (806) 555-1234 or 806-555-1234"
                      onChange={(e) => setPhoneLen(e.currentTarget.value.length)}
                    />
                    <div className="text-xs text-white/45 min-h-[1rem]">{phoneLen}/{PHONE_MAX}</div>
                  </Field>
                  <Field label="Company">
                    <input name="company" className={inputClass} placeholder="Business name" />
                    <div className="text-xs text-white/45 min-h-[1rem]" aria-hidden="true" />
                  </Field>
                </div>

                <Field label={`Message (${ticketLabel})`}>
                  <textarea
                    name="message"
                    required
                    maxLength={MESSAGE_MAX}
                    className={`${inputClass} min-h-[140px] resize-y`}
                    placeholder={
                      ticketType === "msp"
                        ? "Example: 12 users, 18 devices, 2 locations. Need monitoring, security, backups, and helpdesk."
                        : ticketType === "project"
                        ? "Example: New site build-out, VLANs + Wi-Fi redesign, cameras, timeline, address, constraints."
                        : "What’s going on? What do you need help with?"
                    }
                    onChange={(e) => setMessageLen(e.currentTarget.value.length)}
                  />
                  <div className="text-xs text-white/45 min-h-[1rem]">{messageLen}/{MESSAGE_MAX}</div>
                </Field>

                {err ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {err}
                    {err.toLowerCase().includes("origin") ? (
                      <div className="mt-2 text-xs text-red-100/80">
                        This usually means the backend allowlist doesn’t include this domain. Please add{" "}
                        <span className="font-semibold">
                          {typeof window !== "undefined" ? window.location.origin : "this origin"}
                        </span>{" "}
                        to the allowed origins.
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {okMsg ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {okMsg}
                  </div>
                ) : null}

                <button
                  disabled={loading}
                  className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-white transition duration-300 ease-out hover:bg-cyan-400 hover:shadow-[0_12px_40px_rgba(34,211,238,0.25),0_0_0_1px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting…" : "Submit"}
                </button>

                <div className="text-xs text-white/50">By submitting, you agree we may contact you via email/phone about this request.</div>
              </div>
            </form>
          </div>
        </section>

        <footer className="order-80 border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={goTop}
              className="text-left hover:text-white/80 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-2 py-1 -mx-2"
              aria-label="Go to top"
            >
              <div>
                © {new Date().getFullYear()} GlobalTech (DBA of Lone Star GlobalTech)
                <div className="mt-1 text-xs text-white/45">Texas Private Security License: B30867701</div>
              </div>
            </button>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
              <div className="flex flex-wrap gap-4">
                <a href="/msp" className="hover:text-white" aria-label="Open MSP plans">
                  MSP Plans
                </a>
                <button className="hover:text-white" type="button" onClick={() => scrollToId("solutions")}>
                  Solutions
                </button>
                <button className="hover:text-white" type="button" onClick={() => scrollToId("why")}>
                  Why GlobalTech
                </button>
                <button className="hover:text-white" type="button" onClick={() => scrollToId("projects")}>
                  Projects
                </button>
                <a href="/careers" className="hover:text-white" aria-label="Open Careers">
                  Careers
                </a>
                <button className="hover:text-white" type="button" onClick={() => scrollToId("process")}>
                  How We Work
                </button>
                <button className="hover:text-white" type="button" onClick={() => scrollToId("contact")}>
                  Contact
                </button>

                <a href="/privacy-policy" className="hover:text-white" aria-label="Open Privacy Policy">
                  Privacy Policy
                </a>
                <a href="/terms-and-conditions" className="hover:text-white" aria-label="Open Terms and Conditions">
                  Terms &amp; Conditions
                </a>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/lonestarglobaltech"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Open Facebook"
                  title="Facebook"
                >
                  <Image src="/facebook.png" alt="Facebook" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
                </a>
                <a
                  href="https://www.linkedin.com/company/lone-star-globaltech?trk=profile-position"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Open LinkedIn"
                  title="LinkedIn"
                >
                  <Image src="/linkedin.png" alt="LinkedIn" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
                </a>
                <a
                  href="https://share.google/eBefco64FqxeL9EhM"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Open Google Business"
                  title="Google"
                >
                  <Image src="/google.png" alt="Google Business" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}

function TypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 text-sm font-semibold border ${
        active ? "bg-cyan-500 border-cyan-300 text-white" : "border-white/15 text-white/70 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="ui-nav-link">
      {children}
    </button>
  );
}
