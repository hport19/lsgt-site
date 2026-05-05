import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Cloud, HelpCircle, LifeBuoy, LockKeyhole, MonitorCog, Network, ShieldCheck, Users } from "lucide-react";
import { DpsTrustBadge, PageBackdrop, SiteFooter, SiteHeader } from "@/src/components/site/conversion-shell";
import { LeadForm } from "@/src/components/site/lead-form";
import { CTA, SITE } from "@/src/lib/site-config";

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
  "Slow support when your team needs help now",
  "Downtime that interrupts sales, service, or operations",
  "Security concerns nobody is clearly responsible for",
  "No internal IT team or one overloaded person",
  "Unpredictable invoices from reactive repairs",
  "Backups, devices, and email managed inconsistently",
] as const;

const benefits = [
  "Fast helpdesk support from real people",
  "Predictable monthly IT support",
  "Proactive monitoring and maintenance",
  "Security-aware IT help",
  "Local, relationship-based service",
  "Scalable support as your team grows",
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
                Free IT assessment for growing businesses
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[0.01em] md:text-6xl">
                Get IT support that feels responsive, personal, and easy to work with.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/74">
                If your business is tired of slow support, surprise IT costs, or security worries, we will help you build a simple managed IT plan and follow up personally.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {["Fast follow-up", "No pressure", "Real technician"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white/78">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={SITE.phoneHref} data-analytics-id="msp-hero-phone" className="inline-flex rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/7">
                  {CTA.technician}
                </a>
                <Link href="#services" className="inline-flex items-center gap-2 rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/7">
                  See what is included
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <LeadForm
              formId="msp-hero-form"
              source="msp-hero"
              title="Get a Quick IT Plan"
              description="Send the basics now. We will follow up with a practical MSP path for your users, devices, support, and security."
              submitLabel={CTA.quickPlan}
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

          <section data-analytics-section="msp-mid-form" className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-[0.01em]">Want us to look at your current IT situation?</h2>
                <p className="mt-3 leading-relaxed text-white/70">
                  This is the best next step if you know something needs to improve but are not sure where to start.
                </p>
              </div>
              <LeadForm
                formId="msp-mid-form"
                source="msp-mid"
                title="Request a Technology Assessment"
                description="We will review your users, devices, network, email, security basics, and support needs."
                submitLabel={CTA.assessment}
                showMessage
              />
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

          <section data-analytics-section="msp-trust" className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-[1fr_0.95fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/78">Trust and accountability</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">IT support backed by real security responsibility.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Your IT provider touches sensitive systems. Our Texas DPS private security license helps reinforce that we take
                accountability, security-related services, and customer trust seriously.
              </p>
              <div className="mt-5">
                <DpsTrustBadge />
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <ShieldCheck className="h-8 w-8 text-emerald-200" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">Not every IT provider has this.</h3>
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
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Ready for a simple IT plan?</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Send your info now so we can follow up. You will not be left guessing what to do next.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/72">
                Prefer to call? <a href={SITE.phoneHref} className="font-semibold text-white hover:text-cyan-100">{SITE.phone}</a>
              </div>
            </div>
            <LeadForm
              formId="msp-final-form"
              source="msp-final"
              title="Talk to a Real Technician Today"
              description="Tell us where support is falling short. We will reply with a right-sized next step."
              submitLabel={CTA.technician}
              showMessage
            />
          </section>
        </main>

        <Link
          href="#quick-plan"
          data-analytics-id="msp-sticky-cta"
          className="fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(0,0,0,0.45)] hover:bg-cyan-400 md:left-auto md:right-6 md:w-auto"
        >
          {CTA.quickPlan}
        </Link>

        <SiteFooter />
      </div>
    </div>
  );
}
