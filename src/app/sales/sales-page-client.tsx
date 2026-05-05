"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, HelpCircle, ShieldCheck } from "lucide-react";
import { DpsTrustBadge, PageBackdrop, SiteFooter, SiteHeader } from "@/src/components/site/conversion-shell";
import { LeadForm } from "@/src/components/site/lead-form";
import { SITE } from "@/src/lib/site-config";
import { useDynamicCTA, useUserIntent } from "./sales-intent-hooks";

const painPoints = [
  "Your team waits on tickets instead of working.",
  "Small issues interrupt sales, service, and operations.",
  "Security, backups, and devices have no clear owner.",
  "IT only shows up after something breaks.",
  "Costs keep increasing without warning.",
  "Growth adds users faster than support can keep up.",
] as const;

const trustBadges = [
  { title: "Texas DPS Licensed", text: "Security-related accountability" },
  { title: "Real Technicians", text: "No faceless ticket maze" },
  { title: "Local Relationship Support", text: "Built for long-term trust" },
  { title: "Security-Aware IT", text: "Devices, networks, users, and risk" },
] as const;

const serviceBullets = [
  "Fast helpdesk support",
  "Predictable monthly IT",
  "Security-aware guidance",
  "Clear documentation",
  "Real technician follow-up",
  "No vendor chaos",
] as const;

const consequences = [
  "Small IT issues turn into downtime.",
  "Your team keeps waiting instead of working.",
  "Security risks stay hidden until they hurt.",
  "Costs keep increasing without warning.",
  "You spend owner time chasing IT instead of growth.",
] as const;

const proofCards = [
  {
    image: "/projects/zhx/1.jpg",
    quote:
      "GlobalTech moved fast, cleaned up our infrastructure, and the coverage is night-and-day better. Everything was documented and delivered professionally.",
    author: "Manuel M",
    label: "Local business client",
  },
  {
    image: "/projects/phipps/1.jpg",
    quote:
      "They were thorough, responsive, and extremely professional. Our systems run smoother and we finally have a clear, secure setup.",
    author: "Dr. Phipps",
    label: "Small business owner",
  },
  {
    image: "/projects/bestbuy/1.jpg",
    quote:
      "Professional, efficient, and easy to work with. The team communicated clearly and executed like an enterprise partner.",
    author: "General Manager, Best Buy Amarillo",
    label: "Field service customer",
  },
  {
    image: "/msp/support-tech.jpg",
    quote:
      "They stabilized our systems in under 2 weeks and reduced downtime significantly.",
    author: "Local business client",
    label: "Managed IT outcome",
  },
] as const;

const faqs = [
  {
    q: "How quickly can we get started?",
    a: "Start with the form. We usually reply during business hours with the next step and what we need to review.",
  },
  {
    q: "Do we need to replace our current tools?",
    a: "No. We keep what works and only recommend changes that reduce risk or make support easier.",
  },
  {
    q: "Is this only for companies with 50+ employees?",
    a: "No. We support small and medium teams that need reliable IT without hiring internally.",
  },
  {
    q: "What does the Texas DPS license mean for MSP customers?",
    a: "It adds accountability when IT, cameras, access, and security-related work overlap.",
  },
  {
    q: "What happens after I submit the form?",
    a: "We review your situation and tell you exactly what to fix first. No pressure.",
  },
] as const;

const primaryCtaClass =
  "inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-[0_0_42px_rgba(34,211,238,0.34)]";

const secondaryCtaClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/90 transition duration-300 hover:-translate-y-0.5 hover:bg-white/7";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type IntentCtaProps = {
  href: string;
  label: string;
  analyticsId: string;
  className?: string;
  onHover: () => void;
  onClick: () => void;
};

function IntentCta({ href, label, analyticsId, className, onHover, onClick }: IntentCtaProps) {
  if (href.startsWith("tel:")) {
    return (
      <a
        href={href}
        data-analytics-id={analyticsId}
        className={className}
        onMouseEnter={onHover}
        onFocus={onHover}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      data-analytics-id={analyticsId}
      className={className}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

type StickyCTAProps = {
  show: boolean;
  label: string;
  href: string;
  isReady: boolean;
  onHover: () => void;
  onClick: () => void;
};

function StickyCTA({ show, label, href, isReady, onHover, onClick }: StickyCTAProps) {
  if (!show) return null;

  return (
    <IntentCta
      href={href}
      label={label}
      analyticsId="sales-sticky-cta"
      className={cx(
        "fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(0,0,0,0.45),0_0_34px_rgba(34,211,238,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 md:left-auto md:right-6 md:w-auto",
        isReady && "animate-pulse"
      )}
      onHover={onHover}
      onClick={onClick}
    />
  );
}

type HesitationModalProps = {
  open: boolean;
  onClose: () => void;
  onCtaClick: () => void;
};

function HesitationModal({ open, onClose, onCtaClick }: HesitationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/42 px-4 pb-4 backdrop-blur-[2px] md:items-center md:pb-0" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl border border-white/12 bg-slate-950/94 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.58)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/78">Quick answer</p>
            <h2 className="mt-2 text-2xl font-semibold">Before you go, want a quick answer?</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/62 transition hover:bg-white/8 hover:text-white">
            Close
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          We can tell you what to fix first in minutes.
        </p>
        <Link
          href="#quick-plan"
          data-analytics-id="sales-hesitation-modal-cta"
          onClick={onCtaClick}
          className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,0.24)] transition hover:-translate-y-0.5 hover:bg-cyan-400"
        >
          Get My Fix Plan
        </Link>
      </div>
    </div>
  );
}

export default function SalesPageClient() {
  const intent = useUserIntent();
  const dynamicCta = useDynamicCTA(intent);
  const [dismissedHesitation, setDismissedHesitation] = useState(false);
  const shouldEnhanceForm = intent.scrollDepth >= 60;
  const readyFormClass = shouldEnhanceForm ? "scale-[1.01] ring-2 ring-cyan-300/35 shadow-[0_0_80px_rgba(34,211,238,0.18)]" : "";
  const formMicrocopy = intent.stage === "hesitating"
    ? "Most teams wait too long. You don't have to. No pressure. No sales pitch. Just a clear next step."
    : intent.scrollDepth > 50
      ? "Waiting usually makes this more expensive. No pressure. No sales pitch. Just a clear next step."
      : "No pressure. No sales pitch. Just a clear next step.";
  const heroSupport = intent.heroMessageShifted || intent.stage === "hesitating"
    ? "Most teams in your position wait too long. You don't have to."
    : "Talk to a real technician and get a clear next step. No pressure.";

  return (
    <div className="relative min-h-screen text-neutral-100">
      <PageBackdrop />
      <div className="relative z-10">
        <SiteHeader active="msp" />

        <main>
          <section className="border-y border-cyan-300/14 bg-cyan-950/24" data-analytics-section="sales-urgency-strip" data-reveal>
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 text-sm text-white/78 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">
                If your team is already waiting on IT support, waiting longer usually makes it worse.
              </p>
              <IntentCta
                href={dynamicCta.href}
                label={dynamicCta.label}
                analyticsId="sales-urgency-strip-cta"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/28 bg-cyan-400/12 px-3 py-1.5 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-400/18"
                onHover={intent.registerCtaHover}
                onClick={intent.registerCtaClick}
              />
            </div>
          </section>

          <section
            id="quick-plan"
            data-analytics-section="msp-hero"
            data-intent-section="hero"
            data-reveal
            className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-10 md:grid-cols-[1fr_0.92fr] md:items-center md:pb-16 md:pt-16"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-950/24 px-3 py-1.5 text-xs font-semibold text-cyan-50/86">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Free consultation for growing businesses
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[0.01em] md:text-6xl">
                Your IT issues are costing you time, money, and team productivity.
              </h1>
              <p className="mt-4 text-2xl font-semibold tracking-[0.01em] text-white/90">
                And most companies wait too long to fix it.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/74 transition duration-500">
                {heroSupport}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {trustBadges.map((badge, index) => (
                  <div
                    key={badge.title}
                    data-reveal
                    style={{ transitionDelay: `${index * 55}ms` }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/22 hover:bg-white/[0.065]"
                  >
                    <div className="text-sm font-semibold text-white/88">{badge.title}</div>
                    <div className="mt-1 text-xs text-white/58">{badge.text}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <IntentCta
                  href={dynamicCta.href}
                  label={dynamicCta.label}
                  analyticsId="sales-hero-primary"
                  className={primaryCtaClass}
                  onHover={intent.registerCtaHover}
                  onClick={intent.registerCtaClick}
                />
                <Link
                  href="#quick-plan"
                  data-analytics-id="sales-hero-free-plan"
                  className={secondaryCtaClass}
                  onMouseEnter={intent.registerCtaHover}
                  onFocus={intent.registerCtaHover}
                  onClick={intent.registerCtaClick}
                >
                  Get My Free IT Plan
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-4 grid max-w-2xl gap-2 text-xs text-white/66 sm:grid-cols-2">
                {["Know what to fix first in under 30 minutes", "Real technician, not sales", "Free consultation", "Response within ~15-30 minutes"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-cyan-200" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <LeadForm
              formId="msp-hero-form"
              source="sales-hero"
              title="Get clarity on your IT in the next 15 minutes"
              description="Tell us what's going wrong. We'll tell you what to fix first."
              submitLabel="Talk to a Real Technician"
              microcopy={formMicrocopy}
              autoFocusFirstInput={shouldEnhanceForm}
              showNextSteps
              className={cx("md:sticky md:top-28 transition duration-500", readyFormClass)}
            />
          </section>

          <section data-analytics-section="sales-pattern-interrupt" data-reveal className="border-y border-white/10 bg-slate-950/52">
            <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
              <h2 className="mx-auto max-w-4xl text-3xl font-semibold leading-tight tracking-[0.01em] md:text-5xl">
                You don&apos;t need more IT tools.
                <span className="block text-cyan-100">You need someone who actually takes ownership.</span>
              </h2>
            </div>
          </section>

          <section
            id="msp-pain"
            data-analytics-section="msp-pain"
            data-intent-section="problems"
            data-reveal
            className="border-y border-white/10 bg-white/[0.035]"
          >
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">We hear this all the time</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">IT problems usually start small, then cost real time.</h2>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {painPoints.map((point, index) => (
                  <div
                    key={point}
                    data-reveal
                    style={{ transitionDelay: `${index * 55}ms` }}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/36 p-5 text-white/74 transition duration-300 hover:-translate-y-0.5 hover:border-amber-200/22 hover:bg-white/[0.055]"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" aria-hidden="true" />
                    <div>
                      <span>{point}</span>
                      {index === painPoints.length - 1 && intent.hasSeen("problems") ? (
                        <p className="mt-2 text-xs font-semibold text-cyan-100/72">This usually shows up when teams scale past 10-20 people.</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="max-w-2xl text-sm font-semibold text-white/86">Small issues don&apos;t stay small. Get a clear next step before it spreads.</p>
                <IntentCta
                  href={dynamicCta.href}
                  label={dynamicCta.label}
                  analyticsId="sales-pain-cta"
                  className={primaryCtaClass}
                  onHover={intent.registerCtaHover}
                  onClick={intent.registerCtaClick}
                />
              </div>
            </div>
          </section>

          <section
            data-analytics-section="sales-consequences"
            data-intent-section="cost"
            data-reveal
            className="border-b border-white/10 bg-red-950/10"
          >
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-100/78">Cost of waiting</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">What happens if you don&apos;t fix this?</h2>
                <p className="mt-3 text-white/66">This is what waiting actually costs you:</p>
                {intent.hasSeen("cost") ? (
                  <p className="mt-3 inline-flex rounded-full border border-red-200/20 bg-red-950/24 px-3 py-1.5 text-xs font-semibold text-red-50/82">
                    This is where most budgets quietly leak.
                  </p>
                ) : null}
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-5">
                {consequences.map((item, index) => (
                  <div
                    key={item}
                    data-reveal
                    style={{ transitionDelay: `${index * 55}ms` }}
                    className="rounded-2xl border border-red-300/18 bg-red-950/18 p-4 text-sm font-medium leading-relaxed text-white/78 transition duration-300 hover:-translate-y-0.5 hover:border-red-200/28 hover:bg-red-950/25"
                  >
                    <AlertTriangle className="mb-3 h-5 w-5 text-red-200" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="max-w-2xl text-sm font-semibold text-white/86">
                  If IT is already slowing your team down, waiting makes it worse.
                </p>
                <IntentCta
                  href={dynamicCta.href}
                  label={dynamicCta.label}
                  analyticsId="sales-consequence-cta"
                  className={primaryCtaClass}
                  onHover={intent.registerCtaHover}
                  onClick={intent.registerCtaClick}
                />
              </div>
            </div>
          </section>

          <section data-analytics-section="sales-transition" data-intent-section="relief" data-reveal className="mx-auto max-w-6xl px-4 py-14">
            <div className="rounded-3xl border border-cyan-300/22 bg-cyan-950/14 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Relief</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[0.01em] md:text-4xl">
                You don&apos;t need to rebuild your IT. You just need the right fixes.
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-white/72">
                Clear next step. Fast follow-up. No full overhaul just to get started.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white/84">This is fixable. Want help?</p>
                <IntentCta
                  href={dynamicCta.href}
                  label={dynamicCta.label}
                  analyticsId="sales-relief-cta"
                  className={primaryCtaClass}
                  onHover={intent.registerCtaHover}
                  onClick={intent.registerCtaClick}
                />
              </div>
            </div>
          </section>

          <section
            id="services"
            data-analytics-section="msp-services"
            data-intent-section="services"
            data-reveal
            className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center"
          >
            <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45">
              <Image src="/msp/support-tech.jpg" alt="Technician providing managed IT support" fill className="object-cover opacity-76" sizes="(max-width: 768px) 100vw, 45vw" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.82),rgba(3,7,18,0.12))]" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/12 bg-black/36 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">You get a partner, not just a ticket queue.</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">What you get</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">
                Everything you need to stop dealing with IT problems:
              </h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {serviceBullets.map((item, index) => (
                  <div
                    key={item}
                    data-reveal
                    style={{ transitionDelay: `${index * 55}ms` }}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/24 hover:bg-white/[0.07]"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-200" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section data-analytics-section="sales-proof" data-intent-section="proof" data-reveal className="mx-auto max-w-6xl px-4 pb-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Proof</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">What working with us actually feels like:</h2>
              </div>
              {intent.hasSeen("proof") ? (
                <div className="w-fit rounded-full border border-emerald-200/20 bg-emerald-950/18 px-3 py-1.5 text-xs font-semibold text-emerald-50/82">
                  Trusted by growing teams across Texas
                </div>
              ) : null}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {proofCards.map((card, index) => (
                <article
                  key={card.author}
                  data-reveal
                  style={{ transitionDelay: `${index * 65}ms` }}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/28 hover:shadow-[0_24px_70px_rgba(34,211,238,0.12)]"
                >
                  <div className="relative aspect-[4/3] bg-slate-950/50">
                    <Image
                      src={card.image}
                      alt={`${card.label} project image`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.78),transparent_60%)]" />
                    <div className="absolute bottom-3 left-3 rounded-full border border-white/12 bg-black/38 px-3 py-1.5 text-xs text-white/78 backdrop-blur">
                      {card.label}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-relaxed text-white/74">&ldquo;{card.quote}&rdquo;</p>
                    <p className="mt-3 text-xs font-semibold text-white/58">- {card.author}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section data-analytics-section="msp-mid-form" data-reveal className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-[0.01em]">Want clarity before the next IT issue hits?</h2>
                <p className="mt-3 leading-relaxed text-white/70">
                  Know what to fix first in under 30 minutes.
                </p>
              </div>
              <LeadForm
                formId="msp-mid-form"
                source="sales-mid"
                title="Talk to a real technician about your IT setup"
                description="Tell us what's going wrong. We'll tell you what to fix first."
                submitLabel="Talk to a Real Technician"
                microcopy={formMicrocopy}
                autoFocusFirstInput={shouldEnhanceForm}
                showNextSteps
                className={cx("transition duration-500", readyFormClass)}
                showMessage
              />
            </div>
          </section>

          <section
            data-analytics-section="msp-trust"
            data-intent-section="trust"
            data-reveal
            className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-16 md:grid-cols-[1fr_0.95fr] md:items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/78">Trust and accountability</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">If your IT touches security, accountability matters.</h2>
              <p className="mt-4 text-xl font-semibold text-white/86">Not every provider is licensed for that.</p>
              {intent.hasSeen("trust") ? (
                <p className="mt-3 inline-flex rounded-full border border-emerald-200/20 bg-emerald-950/18 px-3 py-1.5 text-xs font-semibold text-emerald-50/82">
                  Most companies only notice this after a breach.
                </p>
              ) : null}
              <div className="mt-5">
                <DpsTrustBadge />
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200/24">
              <ShieldCheck className="h-8 w-8 text-emerald-200" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">A visible trust signal for security-related work.</h3>
              <p className="mt-3 leading-relaxed text-white/68">
                Cameras, access, networks, devices, and sensitive systems need a higher level of responsibility.
              </p>
            </div>
          </section>

          <section data-analytics-section="msp-faq" data-intent-section="faq" data-reveal className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">FAQ</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Questions before we talk?</h2>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {faqs.map((faq, index) => (
                  <article
                    key={faq.q}
                    data-reveal
                    style={{ transitionDelay: `${index * 55}ms` }}
                    className="rounded-3xl border border-white/10 bg-slate-950/36 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/22"
                  >
                    <HelpCircle className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-semibold">{faq.q}</h3>
                    <p className="mt-2 leading-relaxed text-white/67">{faq.a}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            data-analytics-section="msp-final-form"
            data-intent-section="final"
            data-reveal
            className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-start"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Final step</p>
              <div className="mb-5 rounded-2xl border border-amber-200/18 bg-amber-950/16 p-4 text-sm font-semibold text-amber-50/88">
                At this point, you already know if this is happening to your team.
                {intent.stage === "ready" ? <span className="block pt-1 text-amber-50">And if it is, waiting usually makes it worse.</span> : null}
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Let&apos;s fix this before it slows your business down even more.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                You don&apos;t need a full overhaul. You just need the right next step.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/72">
                Prefer to call? <a href={SITE.phoneHref} className="font-semibold text-white hover:text-cyan-100">{SITE.phone}</a>
              </div>
            </div>
            <LeadForm
              formId="msp-final-form"
              source="sales-final"
              title="Talk to a Real Technician"
              description="Tell us what's going wrong. We'll tell you what to fix first."
              submitLabel="Talk to a Real Technician"
              microcopy={formMicrocopy}
              autoFocusFirstInput={shouldEnhanceForm}
              showNextSteps
              className={cx("transition duration-500", readyFormClass)}
              showMessage
            />
          </section>
        </main>

        <HesitationModal
          open={intent.showHesitationPrompt && !dismissedHesitation}
          onClose={() => {
            setDismissedHesitation(true);
            intent.registerInteraction();
          }}
          onCtaClick={() => {
            setDismissedHesitation(true);
            intent.registerCtaClick();
          }}
        />

        <StickyCTA
          show={intent.scrollDepth >= 30}
          href={dynamicCta.href}
          label={dynamicCta.label}
          isReady={intent.stage === "ready"}
          onHover={intent.registerCtaHover}
          onClick={intent.registerCtaClick}
        />

        <SiteFooter />
      </div>
    </div>
  );
}
