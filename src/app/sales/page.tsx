import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Cloud, HelpCircle, LifeBuoy, LockKeyhole, MonitorCog, Network, ShieldCheck, Users } from "lucide-react";
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

const benefits = [
  "Real technician follow-up",
  "Predictable monthly support",
  "Proactive monitoring and maintenance",
  "Security-aware IT guidance",
  "Local, relationship-based service",
  "A support path your team can actually use",
] as const;

const trustBadges = [
  { title: "Texas DPS Licensed", text: "Security-related accountability" },
  { title: "Real Technicians", text: "No faceless ticket maze" },
  { title: "Local Relationship Support", text: "Built for long-term trust" },
  { title: "Security-Aware IT", text: "Devices, networks, users, and risk" },
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

const services = [
  { icon: LifeBuoy, title: "Managed IT Support", text: "Helpdesk, troubleshooting, onboarding, and practical day-to-day support." },
  { icon: Users, title: "Helpdesk Support", text: "A clear place for employees to ask for help without chasing random vendors." },
  { icon: Network, title: "Network Management", text: "Wi-Fi, firewalls, switches, documentation, and stability checks." },
  { icon: LockKeyhole, title: "Cybersecurity Basics", text: "MFA, endpoint protection, policies, alert review, and safer defaults." },
  { icon: Cloud, title: "Cloud & Email Support", text: "Microsoft 365, Google Workspace, email access, licensing, and user changes." },
  { icon: MonitorCog, title: "Device & User Management", text: "Patching, device standards, account changes, and employee transitions." },
] as const;

const faqs = [
  {
    q: "How quickly can we get started?",
    a: "Most small teams can start with a discovery call and basic assessment right away. Onboarding timing depends on users, devices, locations, and current issues.",
  },
  {
    q: "Do we need to replace our current tools?",
    a: "Not automatically. We review what you already use, keep what works, and recommend changes only where they reduce risk or improve support.",
  },
  {
    q: "Is this only for companies with 50+ employees?",
    a: "No. We are ready to support small and medium businesses, including teams around 5-25 users that need reliable IT without hiring internally.",
  },
  {
    q: "What does the Texas DPS license mean for MSP customers?",
    a: "It means Lone Star GlobalTech is licensed by Texas DPS for security-related services. For clients, that adds trust and accountability when IT, cameras, access, and security overlap.",
  },
] as const;

export default function SalesPage() {
  return (
    <div className="relative min-h-screen text-neutral-100">
      <PageBackdrop />
      <div className="relative z-10">
        <SiteHeader active="msp" />

        <main>
          <section id="quick-plan" data-analytics-section="msp-hero" className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-10 md:grid-cols-[1fr_0.92fr] md:items-center md:pb-16 md:pt-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-950/24 px-3 py-1.5 text-xs font-semibold text-cyan-50/86">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Free consultation for growing businesses
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[0.01em] md:text-6xl">
                Stop dealing with slow IT support and constant tech issues.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/74">
                Talk to a real technician today and get a simple IT plan for your business. No pressure, no confusing tech talk, just a practical next step.
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
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/56">
                Free consultation. No pressure. Real technician follow-up. We usually respond within 15-30 minutes during business hours.
              </p>
            </div>

            <LeadForm
              formId="msp-hero-form"
              source="sales-hero"
              title="Get a quick IT plan from a real technician"
              description="Send the basics now. We will follow up with the right person and recommend a practical next step."
              submitLabel="Talk to a Real Technician"
              className="md:sticky md:top-28"
            />
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

          <section data-analytics-section="sales-transition" className="mx-auto max-w-6xl px-4 py-14">
            <div className="rounded-3xl border border-cyan-300/22 bg-cyan-950/14 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">The better path</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[0.01em] md:text-4xl">
                You do not need a bigger IT mess. You need a clear support path.
              </h2>
              <p className="mt-4 max-w-4xl leading-relaxed text-white/72">
                Lone Star GlobalTech helps businesses move from reactive IT problems to predictable, relationship-based support:
                clear helpdesk access, documented systems, security-aware guidance, and a technician who can explain the next step in plain language.
              </p>
            </div>
          </section>

          <section data-analytics-section="msp-solution" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45">
              <Image src="/msp/support-tech.jpg" alt="Technician providing managed IT support" fill className="object-cover opacity-76" sizes="(max-width: 768px) 100vw, 45vw" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.82),rgba(3,7,18,0.12))]" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/12 bg-black/36 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">You get a partner, not just a ticket queue.</p>
                <p className="mt-1 text-sm text-white/72">We focus on follow-through, plain language, and practical next steps.</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Managed IT services</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">We keep your technology supported, documented, and easier to trust.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Our MSP service gives your business a clear support path: helpdesk, monitoring, security basics, network guidance,
                cloud/email support, device management, and backup/recovery planning.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/74">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="services" data-analytics-section="msp-services" className="mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Services included or available</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Everything your business needs for a stronger IT foundation.</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <Icon className="h-7 w-7 text-cyan-200" aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
                    <p className="mt-2 leading-relaxed text-white/67">{service.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section data-analytics-section="sales-proof" className="mx-auto max-w-6xl px-4 pb-16">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Proof</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Real support for real businesses.</h2>
              <p className="mt-3 leading-relaxed text-white/68">
                Local teams trust GlobalTech because the work is documented, responsive, and handled by people who understand field realities.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {proofCards.map((card) => (
                <article key={card.author} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <div className="relative aspect-[4/3] bg-slate-950/50">
                    <Image src={card.image} alt={`${card.label} project image`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
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
                <h2 className="text-3xl font-semibold tracking-[0.01em]">Want us to look at your current IT setup?</h2>
                <p className="mt-3 leading-relaxed text-white/70">
                  Send us the basics and we will tell you the practical next step. No overcomplicated proposal just to start a conversation.
                </p>
              </div>
              <LeadForm
                formId="msp-mid-form"
                source="sales-mid"
                title="Request My IT Assessment"
                description="We will review your users, devices, network, email, security basics, and support needs."
                submitLabel="Request My IT Assessment"
                showMessage
              />
            </div>
          </section>

          <section data-analytics-section="msp-trust" className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-[1fr_0.95fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/78">Trust and accountability</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Not every IT provider has this level of accountability.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                When your IT provider touches cameras, access, networks, devices, and sensitive systems, accountability matters.
                Our Texas DPS Private Security License helps reinforce that we take security-related work seriously.
              </p>
              <div className="mt-5">
                <DpsTrustBadge />
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <ShieldCheck className="h-8 w-8 text-emerald-200" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">A visible trust signal for security-related work.</h3>
              <p className="mt-3 leading-relaxed text-white/68">
                It is not a slogan. It is a meaningful differentiator when your business wants IT help from a team that understands
                compliance, physical security, and technology operations together.
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
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Let&apos;s fix your IT situation.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                You do not have to keep guessing what to do next. Send us the basics and we will follow up with a practical next step.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/72">
                Prefer to call? <a href={SITE.phoneHref} className="font-semibold text-white hover:text-cyan-100">{SITE.phone}</a>
              </div>
            </div>
            <LeadForm
              formId="msp-final-form"
              source="sales-final"
              title="Talk to a Real Technician"
              description="Tell us where support is falling short. We will reply with a right-sized next step."
              submitLabel="Talk to a Real Technician"
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
