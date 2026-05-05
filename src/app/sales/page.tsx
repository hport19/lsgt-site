import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, HelpCircle, ShieldCheck } from "lucide-react";
import { DpsTrustBadge, PageBackdrop, SiteFooter, SiteHeader } from "@/src/components/site/conversion-shell";
import { LeadForm } from "@/src/components/site/lead-form";
import { SITE } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Get a Quick IT Plan",
  description:
    "Paid-traffic MSP lead page for Lone Star GlobalTech. Get a quick IT plan, talk to a real technician, and request managed IT support.",
  alternates: {
    canonical: "/sales",
  },
  openGraph: {
    title: "Get a Quick IT Plan | GlobalTech",
    description:
      "Friendly, security-aware managed IT support for small and medium businesses. Get a quick IT plan and talk to a real technician.",
    url: "/sales",
    type: "website",
    siteName: "GlobalTech",
    images: [
      {
        url: "/msp/opengraph-image?v=3",
        width: 1200,
        height: 630,
        alt: "Get a Quick IT Plan | GlobalTech",
      },
    ],
  },
};

const painPoints = [
  "Your team waits too long for help.",
  "IT issues interrupt sales, service, and operations.",
  "Nobody clearly owns security, backups, or devices.",
  "You only hear from IT when something breaks.",
  "Costs feel unpredictable because everything is reactive.",
  "Your business is growing, but your support process is not.",
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
  "Your team keeps waiting for support.",
  "Security risks go unnoticed.",
  "Costs stay unpredictable.",
  "You lose time focusing on IT instead of your business.",
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
] as const;

export default function SalesPage() {
  return (
    <div className="relative min-h-screen text-neutral-100">
      <PageBackdrop />
      <div className="relative z-10">
        <SiteHeader active="msp" />

        <main>
          <section className="border-y border-cyan-300/14 bg-cyan-950/24" data-analytics-section="sales-urgency-strip">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 text-sm text-white/78 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">
                If your team is already waiting on IT support, waiting longer usually makes it worse.
              </p>
              <Link
                href="#quick-plan"
                data-analytics-id="sales-urgency-strip-cta"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/28 bg-cyan-400/12 px-3 py-1.5 text-xs font-semibold text-cyan-50 hover:bg-cyan-400/18"
              >
                Talk to a Real Technician
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section id="quick-plan" data-analytics-section="msp-hero" className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-10 md:grid-cols-[1fr_0.92fr] md:items-center md:pb-16 md:pt-16">
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
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/74">
                Talk to a real technician and get a clear next step. No pressure.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {trustBadges.map((badge) => (
                  <div key={badge.title} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <div className="text-sm font-semibold text-white/88">{badge.title}</div>
                    <div className="mt-1 text-xs text-white/58">{badge.text}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={SITE.phoneHref} data-analytics-id="sales-hero-phone" className="inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-400">
                  Talk to a Real Technician
                </a>
                <Link href="#quick-plan" data-analytics-id="sales-hero-free-plan" className="inline-flex items-center gap-2 rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/7">
                  Get My Free IT Plan
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-4 grid max-w-2xl gap-2 text-xs text-white/62 sm:grid-cols-2">
                {["Free consultation", "No pressure", "Real technician, not sales", "Response within ~15-30 minutes"].map((item) => (
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
              description="We will review your situation and tell you exactly what to fix first."
              submitLabel="Talk to a Real Technician"
              microcopy="No pressure. Real technician follow-up. Usually within 15-30 minutes."
              className="md:sticky md:top-28"
            />
          </section>

          <section data-analytics-section="sales-pattern-interrupt" className="border-y border-white/10 bg-slate-950/52">
            <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
              <h2 className="mx-auto max-w-4xl text-3xl font-semibold leading-tight tracking-[0.01em] md:text-5xl">
                You don&apos;t need more IT tools.
                <span className="block text-cyan-100">You need someone who actually takes ownership.</span>
              </h2>
            </div>
          </section>

          <section data-analytics-section="msp-pain" className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">We hear this all the time</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">IT problems usually start small, then cost real time.</h2>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {painPoints.map((point) => (
                  <div key={point} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/36 p-5 text-white/74">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section data-analytics-section="sales-consequences" className="border-b border-white/10 bg-red-950/10">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-100/78">Cost of waiting</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">What happens if you don&apos;t fix this?</h2>
                <p className="mt-3 text-white/66">This is what waiting actually costs you:</p>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-5">
                {consequences.map((item) => (
                  <div key={item} className="rounded-2xl border border-red-300/18 bg-red-950/18 p-4 text-sm leading-relaxed text-white/76">
                    <AlertTriangle className="mb-3 h-5 w-5 text-red-200" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="max-w-2xl text-sm font-semibold text-white/86">
                  If IT is already slowing your team down, waiting makes it worse.
                </p>
                <Link
                  href="#quick-plan"
                  data-analytics-id="sales-consequence-cta"
                  className="inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-400"
                >
                  Talk to a Real Technician
                </Link>
              </div>
            </div>
          </section>

          <section data-analytics-section="sales-transition" className="mx-auto max-w-6xl px-4 py-14">
            <div className="rounded-3xl border border-cyan-300/22 bg-cyan-950/14 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Relief</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[0.01em] md:text-4xl">
                This is fixable. And it doesn&apos;t require a full IT overhaul.
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-white/72">
                Lone Star GlobalTech gives you a clear support path, fast help from real people, and practical next steps your team can actually use.
              </p>
            </div>
          </section>

          <section id="services" data-analytics-section="msp-services" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center">
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
                {serviceBullets.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white/80">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-200" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section data-analytics-section="sales-proof" className="mx-auto max-w-6xl px-4 pb-16">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Proof</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">What working with us actually feels like:</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {proofCards.map((card) => (
                <article
                  key={card.author}
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

          <section data-analytics-section="msp-mid-form" className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-[0.01em]">Want clarity before the next IT issue hits?</h2>
                <p className="mt-3 leading-relaxed text-white/70">
                  Send the basics. We will review your situation and tell you what to fix first.
                </p>
              </div>
              <LeadForm
                formId="msp-mid-form"
                source="sales-mid"
                title="Talk to a real technician about your IT setup"
                description="We will review your situation and tell you exactly what to fix first."
                submitLabel="Talk to a Real Technician"
                microcopy="No pressure. Real technician follow-up. Usually within 15-30 minutes."
                showMessage
              />
            </div>
          </section>

          <section data-analytics-section="msp-trust" className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-[1fr_0.95fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/78">Trust and accountability</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">If your IT touches security, accountability matters.</h2>
              <p className="mt-4 text-xl font-semibold text-white/86">Not every provider is licensed for that.</p>
              <div className="mt-5">
                <DpsTrustBadge />
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <ShieldCheck className="h-8 w-8 text-emerald-200" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">A visible trust signal for security-related work.</h3>
              <p className="mt-3 leading-relaxed text-white/68">
                Cameras, access, networks, devices, and sensitive systems need a higher level of responsibility.
              </p>
            </div>
          </section>

          <section data-analytics-section="msp-faq" className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">FAQ</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Questions before we talk?</h2>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {faqs.map((faq) => (
                  <article key={faq.q} className="rounded-3xl border border-white/10 bg-slate-950/36 p-6">
                    <HelpCircle className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-semibold">{faq.q}</h3>
                    <p className="mt-2 leading-relaxed text-white/67">{faq.a}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section data-analytics-section="msp-final-form" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Final step</p>
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
              description="We will review your situation and tell you exactly what to fix first."
              submitLabel="Talk to a Real Technician"
              microcopy="No pressure. Real technician follow-up. Usually within 15-30 minutes."
              showMessage
            />
          </section>
        </main>

        <Link
          href="#quick-plan"
          data-analytics-id="sales-sticky-cta"
          className="fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(0,0,0,0.45)] hover:bg-cyan-400 md:left-auto md:right-6 md:w-auto"
        >
          Talk to a Real Technician
        </Link>

        <SiteFooter />
      </div>
    </div>
  );
}
