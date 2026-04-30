import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Headphones, LockKeyhole, MonitorCheck, Network, Phone, ShieldCheck, Users } from "lucide-react";
import { DpsTrustBadge, PageBackdrop, SiteFooter, SiteHeader } from "@/src/components/site/conversion-shell";
import { LeadForm } from "@/src/components/site/lead-form";
import { CTA, SITE } from "@/src/lib/site-config";

const pains = [
  "Support takes too long when something breaks",
  "Your team loses time to slow computers, Wi-Fi, printers, or email problems",
  "Security and backups feel important, but nobody owns them clearly",
  "IT costs show up as surprises instead of a predictable plan",
] as const;

const services = [
  { icon: Headphones, title: "Managed IT Support", text: "Day-to-day helpdesk support, troubleshooting, onboarding, and practical guidance." },
  { icon: MonitorCheck, title: "Device & User Management", text: "Microsoft 365, accounts, devices, patching, policies, and clean documentation." },
  { icon: Network, title: "Network Management", text: "Wi-Fi, switches, firewalls, cabling, monitoring, and cleaner business connectivity." },
  { icon: LockKeyhole, title: "Security-Aware IT", text: "MFA, endpoint protection, backup guidance, and support from a DPS-licensed security provider." },
] as const;

const steps = [
  { title: "Quick conversation", text: "We listen first. Tell us what is breaking, what feels risky, and what your team needs." },
  { title: "Simple IT plan", text: "You get a right-sized plan for support, security, devices, email, backups, and network basics." },
  { title: "Clean onboarding", text: "We document your environment, stabilize the essentials, and give your team a clear way to request help." },
] as const;

const proof = [
  "Current capacity for 5-10 new MSP customers",
  "Local, relationship-based support",
  "Licensed by Texas DPS for security-related services",
  "Infrastructure, phones, cameras, and managed IT under one team",
] as const;

export default function HomeConversionPage() {
  return (
    <div className="relative min-h-screen text-neutral-100">
      <PageBackdrop />
      <div className="relative z-10">
        <SiteHeader active="home" />

        <main>
          <section data-analytics-section="home-hero" className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-10 md:grid-cols-[1.02fr_0.98fr] md:items-center md:pb-16 md:pt-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-950/24 px-3 py-1.5 text-xs font-semibold text-cyan-50/86">
                <Users className="h-4 w-4" aria-hidden="true" />
                IT support for small and medium businesses
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[0.01em] md:text-6xl">
                Friendly managed IT support that keeps your business moving.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/74">
                Lone Star GlobalTech helps growing teams get faster support, fewer surprises, stronger security basics, and a real
                technology partner they can call when things feel stuck.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/msp#quick-plan"
                  data-analytics-id="home-hero-quick-plan"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-400"
                >
                  {CTA.quickPlan}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={SITE.phoneHref}
                  data-analytics-id="home-hero-technician"
                  className="inline-flex rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/7"
                >
                  {CTA.technician}
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {proof.map((item) => (
                  <div key={item} className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/74">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
                <Image src="/media/external/msp-ops-team.jpg" alt="Friendly managed IT support team" fill className="object-cover opacity-72" sizes="(max-width: 768px) 100vw, 46vw" priority />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.88),rgba(3,7,18,0.18))]" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/12 bg-black/36 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">You do not have to figure IT out alone.</p>
                  <p className="mt-1 text-sm text-white/72">We help you turn messy support, security, and device issues into a clear plan.</p>
                </div>
              </div>
              <DpsTrustBadge compact />
            </div>
          </section>

          <section id="problems" data-analytics-section="home-problems" className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">You are probably here because</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Technology should not be the thing slowing your team down.</h2>
              </div>
              <div className="mt-7 grid gap-3 md:grid-cols-2">
                {pains.map((pain) => (
                  <div key={pain} className="rounded-2xl border border-white/10 bg-slate-950/36 p-5 text-white/76">
                    {pain}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="services" data-analytics-section="home-services" className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">What we manage</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">The IT pieces small businesses need handled well.</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-white/68">
                  We keep the service plain-English and practical: support when your team needs help, monitoring before issues grow,
                  security basics that are actually maintained, and infrastructure that is documented.
                </p>
              </div>
              <Link href="/msp" className="inline-flex w-fit rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/88 hover:bg-white/7">
                View MSP services
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
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

          <section id="why-us" data-analytics-section="home-why-us" className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div className="relative min-h-[340px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45">
              <Image src="/media/external/security-camera.jpg" alt="Security-aware technology installation" fill className="object-cover opacity-72" sizes="(max-width: 768px) 100vw, 45vw" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.84),rgba(3,7,18,0.14))]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/24 bg-emerald-950/18 px-3 py-1.5 text-xs font-semibold text-emerald-50/84">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                A higher standard of trust
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Not just IT support. Security-aware, accountable technology help.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Not every IT provider carries a Texas DPS private security license. For customers, it is a simple trust signal:
                we understand that technology, cameras, access, compliance, and security responsibility are connected.
              </p>
              <div className="mt-5">
                <DpsTrustBadge />
              </div>
            </div>
          </section>

          <section data-analytics-section="home-process" className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">How to get started</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">A simple path from “we need help” to “we have a plan.”</h2>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <div key={step.title} className="rounded-3xl border border-white/10 bg-slate-950/36 p-6">
                    <div className="text-xs font-semibold text-cyan-100/70">0{index + 1}</div>
                    <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-white/67">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" data-analytics-section="home-contact" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Start here</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Tell us what is going on. We will help you sort the next step.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Use the form for a free consultation, quick IT plan, or technology assessment. For urgent support, call and talk to a real person.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={SITE.phoneHref} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {CTA.supportNow}
                </a>
                <a href={SITE.emailHref} className="inline-flex rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/88 hover:bg-white/7">
                  Email us
                </a>
              </div>
            </div>
            <LeadForm
              formId="home-contact-form"
              source="home-contact"
              title="Schedule a Free Consultation"
              description="Send your name, company, and best contact info. We will follow up with a practical IT plan."
              submitLabel={CTA.consultation}
              showMessage
            />
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
