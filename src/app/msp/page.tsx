import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandFooter } from "@/src/components/site/brand-shell";
import BuildYourPlan, { type BuilderAddOn, type BuilderPlan } from "./components/build-your-plan";

type PageSearchParams = {
  v?: string;
};

type PageProps = {
  searchParams?: Promise<PageSearchParams>;
};

const PLANS: Array<BuilderPlan & { features: string[] }> = [
  {
    id: "essential",
    name: "Essential",
    price: 89,
    shortLabel: "Stability + day-to-day support",
    closeCopy: "Reliable IT operations without overbuying.",
    bestFor: "Best for teams that want fast help and fewer surprises.",
    includesAddOns: [],
    features: [
      "Unlimited Help Desk (Business Hours)",
      "24/7 Monitoring",
      "Endpoint & Patch Management (Microsoft Intune)",
      "Managed Endpoint Protection (Microsoft Defender)",
      "User account basics (add / remove / reset)",
      "Monthly IT Health Report",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 139,
    shortLabel: "Backup + security + priority response",
    recommended: true,
    closeCopy: "Most popular for growing teams that need stronger protection.",
    bestFor: "Best for growing teams that need faster response and backup coverage.",
    includesAddOns: ["email-management", "endpoint-backup"],
    features: [
      "Everything in Essential",
      "Email Management (M365 / Google Workspace)",
      "Endpoint Backup (daily) for workstations and laptops",
      "Priority support (faster response)",
      "Monthly security review + action items",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    shortLabel: "Maximum protection + accountability",
    closeCopy: "Built for multi-site, regulated, and high-risk environments.",
    bestFor: "Best for organizations where downtime and compliance gaps are costly.",
    includesAddOns: ["email-management", "endpoint-backup", "advanced-security", "server-backup-dr"],
    features: [
      "Everything in Professional",
      "Advanced Security (Microsoft Defender + MFA policies)",
      "Server Backup & Disaster Recovery (from $250/server/mo depending on storage/RTO)",
      "Quarterly IT strategy review",
      "Best for multi-site / regulated",
    ],
  },
];

const ADD_ONS: Array<
  BuilderAddOn & {
    subtitle?: string;
    valueLine?: string;
    secondaryPriceLabel?: string;
    requiresEssential?: boolean;
    description?: string;
    descriptionOutcomeLine?: string;
    details?: string[];
    detailSections?: Array<{
      title: string;
      body?: string;
      items?: string[];
    }>;
    smallPrint?: string;
  }
> = [
  {
    id: "email-management",
    name: "Email Management",
    basis: "user",
    rate: 29,
    priceLabel: "$29 / user / month",
    requiresEssential: true,
    details: ["M365 / Google Workspace administration", "User onboarding/offboarding", "Mailbox and access policy support"],
  },
  {
    id: "email-backup",
    name: "Email Backup",
    basis: "user",
    rate: 8,
    priceLabel: "$8 / user / month",
    requiresEssential: true,
    details: ["Mailbox backup retention", "Fast mailbox restore options", "Coverage for accidental deletion events"],
  },
  {
    id: "endpoint-backup",
    name: "Endpoint Backup",
    basis: "device",
    rate: 20,
    priceLabel: "$20 / device / month",
    requiresEssential: true,
    details: ["Daily backup for laptops/workstations", "Fast file recovery", "Coverage for remote and office devices"],
  },
  {
    id: "server-backup-dr",
    name: "Server Backup & DR",
    basis: "server",
    rate: 250,
    priceLabel: "from $250 / server / month",
    requiresEssential: true,
    details: ["Image-based backup", "Disaster recovery planning", "Pricing depends on storage and RTO targets"],
  },
  {
    id: "advanced-security",
    name: "Advanced Security (Defender hardening + MFA policies)",
    basis: "user",
    rate: 39,
    priceLabel: "$39 / user / month",
    requiresEssential: true,
    details: [
      "Microsoft Defender policy hardening",
      "MFA policy enforcement with Microsoft Entra ID",
      "Security review outputs with clear action items",
    ],
  },
  {
    id: "business-phone-system",
    name: "Business Phone System (Managed VoIP)",
    subtitle: "Deploy + Manage",
    basis: "user",
    rate: 18,
    priceLabel: "Management: from $18 / user / month",
    secondaryPriceLabel: "Carrier (Telnyx): billed separately",
    requiresEssential: true,
    estimateMode: "requires-user-input",
    description:
      "Your phones should work as hard as your team. We deploy and manage modern VoIP systems that keep calls flowing, customers answered, and your front desk organized.",
    descriptionOutcomeLine: "Calls are revenue. Downtime is lost money.",
    detailSections: [
      {
        title: "What we do",
        items: [
          "Design and deploy a new VoIP system or take over your existing one",
          "Configure call routing, auto attendants, voicemail, business hours, and holiday schedules",
          "Add/remove users and extensions",
          "Ongoing management and support",
          "Coordinate directly with Telnyx carrier",
        ],
      },
      {
        title: "Billing structure",
        body: "Carrier service (Telnyx) is billed separately. If preferred, we can manage carrier billing on your behalf so you only deal with one partner.",
      },
      {
        title: "Why this matters",
        body: "When your phones stop, your business stops. We make sure your call flow, routing, and carrier coordination are handled proactively - not reactively.",
      },
    ],
    smallPrint: "Ideal for medical, legal, professional services, and customer-facing teams.",
  },
  {
    id: "network-management",
    name: "Network Management",
    basis: "flat",
    rate: 195,
    priceLabel: "from $195 / month",
    requiresEssential: true,
    details: ["Firewall, Wi-Fi, switching oversight", "Monitoring and optimization", "Best for multi-site reliability"],
  },
  {
    id: "security-cameras-managed",
    name: "Security Cameras (Managed)",
    subtitle: "Install + Ongoing Management",
    valueLine: "Security that someone is actually watching.",
    basis: "flat",
    rate: 79,
    priceLabel: "Management: from $79 / month",
    secondaryPriceLabel: "Hardware & Installation: project-based",
    requiresEssential: true,
    estimateMode: "scope-based",
    description:
      "We don't just install cameras. We monitor system health, keep firmware updated, and make sure remote access stays secure.",
    descriptionOutcomeLine: "Without ongoing management, cameras often fail silently.",
    detailSections: [
      {
        title: "Installation",
        items: ["Site planning", "Hardware deployment", "Network configuration", "Secure remote access setup"],
      },
      {
        title: "Ongoing management",
        items: ["Camera health monitoring", "Firmware updates", "Storage and retention configuration", "Troubleshooting support"],
      },
    ],
    smallPrint: "Hardware warranties follow manufacturer terms.",
  },
] as const;

const FAQ_GROUPS = [
  {
    title: "1) Understand How MSP Works",
    subtitle: "Start here if you want the plain-English version",
    items: [
      {
        q: "What is a Managed Service Provider (MSP)?",
        a: "An MSP is your outsourced IT department. We monitor, protect, and maintain your systems every day so your team is not waiting on broken technology.",
      },
      {
        q: "How is this different from hiring internal IT?",
        a: "Internal IT can be excellent, but one person can only cover so much. With an MSP, you get a broader bench and predictable coverage without hiring several full-time roles.",
      },
      {
        q: "Is this only for big companies?",
        a: "No. Most of our clients are small to mid-sized businesses. If you have 5+ users and rely on technology, managed IT is usually a fit.",
      },
      {
        q: "What happens if we already have some IT?",
        a: "We can work alongside your current IT person or team. We define responsibilities clearly so nothing falls through the cracks.",
      },
    ],
  },
  {
    title: "2) Pricing, Licensing, and Contracts",
    subtitle: "The most common buying questions before onboarding",
    items: [
      {
        q: "Is this more expensive than break-fix?",
        a: "For most teams, managed IT costs less over time than repeated emergency work. You trade surprise invoices for predictable monthly coverage.",
      },
      {
        q: "How long does onboarding take?",
        a: "Most onboarding takes 5-10 business days depending on size. We start with assessment and documentation, then move systems in a controlled rollout.",
      },
      {
        q: "Are we locked into contracts?",
        a: "Our terms are clear and pricing is transparent. No hidden fees and no surprise charges.",
      },
      {
        q: "Why not just call someone when something breaks?",
        a: "Break-fix waits for problems, then bills you after the fact. Managed IT focuses on prevention, faster recovery, and fewer interruptions.",
      },
      {
        q: "Do you include Microsoft 365 licenses in the monthly price?",
        a: "No. Microsoft 365 Business Premium licensing (starting at $22/user/month) is billed separately. We can manage licensing for you to keep everything consistent and compliant.",
      },
      {
        q: "Do we need Microsoft 365 for this?",
        a: "For full device management and security policies with Intune and Defender, yes. Most clients use Microsoft 365 Business Premium. If you already have licensing, we validate it. If not, we help you choose the right option during onboarding.",
      },
      {
        q: "What if we already have Microsoft 365 licenses?",
        a: "Great. We review what you have and map it to your plan. If anything is missing, we show simple options before rollout.",
      },
      {
        q: "Can you manage our licenses for us?",
        a: "Yes. We can help you purchase, assign, and manage Microsoft 365 licenses so users stay covered and changes stay documented.",
      },
    ],
  },
  {
    title: "3) Risk, Security, and Response",
    subtitle: "How we reduce downtime, security risk, and operational stress",
    items: [
      {
        q: "What if we get hacked?",
        a: "We move quickly to contain, isolate, and recover. We also harden systems ahead of time so your risk is lower before an incident starts.",
      },
      {
        q: "Are backups included?",
        a: "Backup coverage depends on the plan and add-ons you choose. If you already have backups, we test restore readiness and fix any weak points.",
      },
      {
        q: "What happens if your team cannot fix something?",
        a: "If an issue needs a vendor or specialist, we escalate fast and stay on it. You still have one accountable team coordinating resolution end-to-end.",
      },
      {
        q: "How fast do you respond?",
        a: "Response targets are based on urgency and business impact. Professional and Enterprise include faster handling for priority issues.",
      },
      {
        q: "Is Windows Defender good enough?",
        a: "Defender is a solid baseline. The value is in management: we enforce policies, monitor alerts, respond quickly, and keep coverage consistent across all devices.",
      },
      {
        q: "Is MSP the same as a warranty?",
        a: "No. MSP covers monitoring, maintenance, updates, and support. Hardware replacement depends on manufacturer warranty or agreed coverage.",
      },
      {
        q: "What happens if a phone or camera device fails?",
        a: "We troubleshoot first and coordinate warranty when applicable. If the device is out of warranty, we provide clear replacement options and handle installation.",
      },
      {
        q: "What does it actually cost to NOT have managed IT?",
        a: "Usually more than people expect: downtime, lost productivity, ransomware exposure, and emergency repair bills. Managed IT reduces those risks before they become expensive business problems.",
      },
    ],
  },
  {
    title: "4) Growth and Scalability",
    subtitle: "What happens as your team, locations, and systems expand",
    items: [
      {
        q: "What happens if we outgrow our plan?",
        a: "We scale with you. Add users, locations, backup coverage, security layers, or communication systems without starting over. Your MSP plan evolves as your business grows.",
      },
      {
        q: "Can you manage our phone system?",
        a: "Yes. We can deploy a new VoIP system or take over your existing one. Carrier service (Telnyx) is typically billed separately, but we can manage billing for you if preferred.",
      },
      {
        q: "Do you install and manage security cameras?",
        a: "Yes. Installation is a one-time project. Ongoing monitoring and system management is optional and billed monthly.",
      },
    ],
  },
] as const;

export const metadata: Metadata = {
  title: "MSP Plans: Essential, Professional, Enterprise",
  description:
    "Compare GlobalTech MSP plans and add-ons, including managed VoIP phone systems. Build your monthly estimate and request a FREE technology assessment.",
  alternates: {
    canonical: "/msp",
  },
  openGraph: {
    title: "MSP Plans | GlobalTech",
    description:
      "Essential, Professional, and Enterprise plans with add-ons for backup, email, security, managed VoIP, and network management.",
    url: "/msp",
    type: "website",
    siteName: "GlobalTech",
    images: [
      {
        url: "/msp/opengraph-image?v=3",
        width: 1200,
        height: 630,
        alt: "MSP Plans | GlobalTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MSP Plans | GlobalTech",
    description:
      "Compare MSP plans, calculate your estimate, and send your selected plan for direct follow-up.",
    images: ["/msp/opengraph-image?v=3"],
  },
};

export default async function MspPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const variant = params.v?.toLowerCase() === "b" ? "b" : "a";
  const heroTitle =
    variant === "b" ? "Get IT Fully Managed in 7 Days" : "Your IT Department, Fully Managed & Protected";
  const heroSubtitle =
    variant === "b"
      ? "Fast onboarding. Clear monthly pricing. Real support - without surprise invoices."
      : "Stop reacting to IT problems. We keep your systems stable, secure, and supported - so your team can work.";

  return (
    <div className="relative min-h-screen text-neutral-100">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1300px_760px_at_14%_8%,rgba(59,130,246,0.24),rgba(59,130,246,0.14)_34%,rgba(59,130,246,0.05)_62%,transparent_82%),radial-gradient(1100px_700px_at_86%_18%,rgba(56,189,248,0.2),rgba(56,189,248,0.1)_34%,rgba(56,189,248,0.03)_60%,transparent_80%),linear-gradient(160deg,rgba(2,10,26,0.94),rgba(2,8,23,0.98)_58%,rgba(1,7,18,1)_100%)]" />
        <div className="absolute inset-0 lsgt-grid opacity-[0.15]" />
        <div className="absolute inset-0 lsgt-grain opacity-[0.16]" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/55 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 lg:max-w-[92rem] lg:py-4">
            <div className="ui-nav-shell flex items-center justify-between gap-3 rounded-2xl px-3 py-2 lg:px-5 lg:py-3">
            <Link href="/" className="inline-flex items-center gap-3 text-white/90 hover:text-white">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <Image src="/isotipo.png" alt="GlobalTech logo" fill className="object-contain p-1" sizes="40px" priority />
              </div>
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">GlobalTech</div>
                <div className="text-xs text-white/55">Managed IT Services</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 text-sm text-white/75 lg:flex xl:gap-3">
              <a href="#plans" className="ui-nav-link">
                Plans
              </a>
              <a href="#build-plan" className="ui-nav-link">
                Assessment
              </a>
              <a href="#add-ons" className="ui-nav-link">
                Add-Ons
              </a>
              <a href="#faq" className="ui-nav-link">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#build-plan"
                className="inline-flex rounded-xl border border-cyan-300/35 bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_12px_34px_rgba(34,211,238,0.22)] hover:bg-cyan-400 lg:px-6 lg:py-2.5 lg:text-sm"
              >
                Schedule a FREE Assessment
              </a>
              <a
                href="tel:8064849040"
                className="inline-flex rounded-xl border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                Call
              </a>
              <a
                href="mailto:info@lonestarglobaltech.com"
                className="inline-flex rounded-xl border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                Email
              </a>
            </div>
          </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 md:pb-28 md:pt-14">
          <section data-reveal className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl md:grid-cols-[1.08fr_0.92fr] md:p-9">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-950/30 px-3 py-1.5 text-xs font-semibold text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Microsoft-first MSP plans + add-ons
              </div>

              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[0.01em] md:text-6xl">{heroTitle}</h1>
              <p className="mt-4 max-w-2xl text-base text-white/78 md:text-lg">{heroSubtitle}</p>
              <p className="mt-2 text-sm font-medium text-white/85">Built for small businesses that can&apos;t afford downtime.</p>
              <p className="mt-1 text-xs text-cyan-100/85">
                #1 IT Support MSP + #3 Compliance-ready MSP. Powered by Entra ID, Intune, and Defender.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="rounded-xl border border-cyan-300/30 bg-cyan-950/20 px-3 py-2 text-xs font-semibold text-cyan-100">
                  Plans from $89 / user / month
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/78">Minimum 5 users</div>
                <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/78">Onboarding in 5-10 business days</div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#build-plan"
                  className="inline-flex rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(34,211,238,0.25)] hover:bg-cyan-400"
                >
                  Schedule a FREE Assessment
                </a>
                <a
                  href="tel:8064849040"
                  className="inline-flex rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5"
                >
                  Call
                </a>
                <a
                  href="mailto:info@lonestarglobaltech.com"
                  className="inline-flex rounded-2xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/5"
                >
                  Email
                </a>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/35">
              <Image src="/media/external/msp-ops-pro.jpg" alt="Managed IT operations center with active monitoring" fill className="object-cover opacity-35" sizes="(max-width: 1024px) 100vw, 44vw" priority />
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/media/external/msp-ops-pro.jpg"
              >
                <source src="/msp/hero-loop.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,23,0.9),rgba(2,6,23,0.2))]" />
              <div className="absolute inset-x-4 top-4 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/75 backdrop-blur">
                Trusted IT Partner
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-cyan-300/30 bg-cyan-950/25 p-4 backdrop-blur">
                <div className="text-sm font-semibold text-cyan-100">Proactive. Secure. Reliable.</div>
                <div className="mt-1 text-sm text-white/80">Support, security, backup, and compliance-ready operations under one team.</div>
              </div>
            </div>
          </section>

          <section id="plans" data-reveal className="mt-12 scroll-mt-28 md:scroll-mt-32">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  Plans (per user / month, minimum 5 users)
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Choose your MSP plan</h2>
                <p className="mt-2 text-sm text-white/70">Pick the baseline that matches your current risk and growth stage.</p>
              </div>
              <div className="rounded-full border border-cyan-300/30 bg-cyan-950/20 px-3 py-1 text-xs font-semibold text-cyan-100">
                Professional is the most selected plan
              </div>
            </div>
            <p className="mt-3 text-sm text-white/65">Plans are per user/month. Minimum 5 users.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`rounded-2xl border bg-white/6 p-4 transition hover:-translate-y-[2px] ${
                    plan.recommended
                      ? "relative border-cyan-300/45 bg-cyan-950/12 shadow-[0_0_0_1px_rgba(34,211,238,0.28)] md:-translate-y-1"
                      : "border-white/10 hover:border-cyan-300/35"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[1.65rem] font-semibold tracking-[0.01em]">{plan.name}</h3>
                    {plan.recommended ? (
                      <span className="rounded-full border border-cyan-300/35 bg-cyan-950/25 px-2.5 py-1 text-[11px] font-semibold text-cyan-100">
                        Most Popular
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 flex items-end gap-2">
                    <div className="text-6xl font-semibold leading-none text-cyan-100">${plan.price}</div>
                    <div className="pb-1 text-sm text-white/70">/ user / month</div>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white/90">{plan.shortLabel}</p>
                  {plan.closeCopy ? <p className="mt-1.5 text-sm text-white/74">{plan.closeCopy}</p> : null}

                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">Included</p>
                  </div>
                  <ul className="mt-2 grid gap-1.5 text-sm text-white/82">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-[11px] leading-relaxed text-white/68">
                    Microsoft 365 Business Premium licensing is required for full device management and security policies.
                    Licensing is billed separately (starting at $22/user/month). We can manage licensing for you.
                  </p>
                  {plan.bestFor ? <p className="mt-3 text-sm font-medium text-white/85">{plan.bestFor}</p> : null}
                  <a
                    href="#build-plan"
                    className={`mt-3 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      plan.recommended
                        ? "bg-cyan-500 text-white hover:bg-cyan-400"
                        : "border border-white/20 text-white/90 hover:bg-white/5"
                    }`}
                  >
                    Schedule a FREE Assessment
                  </a>
                </article>
              ))}
            </div>
          </section>

          <BuildYourPlan plans={PLANS} addOns={ADD_ONS} />

          <section id="add-ons" data-reveal className="mt-12 scroll-mt-28 md:scroll-mt-32">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Add-Ons (secondary services)</p>
                  <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-950/20 px-3 py-1 text-xs font-semibold text-cyan-100">
                    Essential required
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Add-ons available for all plans</h2>
                <p className="mt-2 text-sm text-white/68">
                  Add coverage as you grow - backup, security, and network management when you need it.
                </p>
                <p className="mt-2 text-xs text-white/58">
                  Most requested after onboarding: backup hardening, managed phone systems, and managed cameras.
                </p>
              </div>
            </div>

            <ul className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {ADD_ONS.map((addOn) => (
                <li key={addOn.id} className="h-full">
                  <details className="group h-full rounded-xl border border-white/10 bg-neutral-950/35 p-3">
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="min-w-0 text-sm font-semibold leading-tight">{addOn.name}</div>
                          </div>
                          {addOn.subtitle ? <div className="text-[11px] text-white/62">{addOn.subtitle}</div> : null}
                          {addOn.valueLine ? <div className="text-[11px] font-medium text-cyan-100/90">{addOn.valueLine}</div> : null}
                          <div className="text-xs text-cyan-100/90">{addOn.priceLabel}</div>
                          {addOn.secondaryPriceLabel ? <div className="text-[11px] text-white/62">{addOn.secondaryPriceLabel}</div> : null}
                        </div>
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/70 group-open:hidden">
                          Details
                        </span>
                        <span className="hidden rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/70 group-open:inline">
                          Close
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 border-t border-white/10 pt-3 text-xs text-white/72">
                      {addOn.description ? <p className="mb-3 leading-relaxed text-white/75">{addOn.description}</p> : null}
                      {addOn.descriptionOutcomeLine ? (
                        <p className="mb-3 text-xs font-semibold tracking-[0.01em] text-white/90">{addOn.descriptionOutcomeLine}</p>
                      ) : null}

                      {addOn.detailSections?.map((section) => (
                        <div key={section.title} className="mb-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100/85">{section.title}</p>
                          {section.body ? <p className="mt-1 leading-relaxed">{section.body}</p> : null}
                          {section.items?.length ? (
                            <ul className="mt-1 grid gap-1">
                              {section.items.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}

                      {addOn.details?.length ? (
                        <ul className="grid gap-1">
                          {addOn.details.map((detail) => (
                            <li key={detail} className="flex gap-2">
                              <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {addOn.smallPrint ? <p className="mt-2 text-[11px] text-white/60">{addOn.smallPrint}</p> : null}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </section>

          <section data-reveal className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Projects vs Managed</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Managed Services vs Warranty - What&apos;s the Difference?</h2>
            <p className="mt-3 max-w-3xl text-sm text-white/75">
              Projects get you installed and working. Managed services keep everything running month after month with updates,
              troubleshooting, and ongoing guidance.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <article className="rounded-2xl border border-cyan-300/25 bg-cyan-950/15 p-4">
                <p className="text-sm font-semibold text-cyan-100">Managed Services (Ongoing)</p>
                <ul className="mt-2 grid gap-1.5 text-sm text-white/80">
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Monitoring, maintenance, and regular updates</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Ongoing changes, troubleshooting, and quick help requests</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Priority response and proactive risk reduction</span>
                  </li>
                </ul>
              </article>

              <article className="rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                <p className="text-sm font-semibold text-white/90">Project + Warranty (One-Time)</p>
                <ul className="mt-2 grid gap-1.5 text-sm text-white/75">
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Project work covers installation or deployment only</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Warranty claims follow manufacturer terms</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>If out of warranty, we provide options and handle replacement as a project</span>
                  </li>
                </ul>
              </article>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/78">
              <p className="font-medium text-white/88">If equipment fails, we troubleshoot first and coordinate warranty when available.</p>
              <p className="mt-1">If you want someone watching it, updating it, and supporting it long-term, that is exactly what MSP covers.</p>
            </div>
          </section>

          <section id="faq" data-reveal className="mt-12 scroll-mt-28 md:scroll-mt-32">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">FAQ</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Answers that remove risk before you buy</h2>
            <p className="mt-2 text-sm text-white/68">Grouped by buying stage: understanding, cost, risk, and scalability.</p>
            <div className="mt-6 grid gap-4">
              {FAQ_GROUPS.map((group) => (
                <section key={group.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
                  <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                    <h3 className="text-lg font-semibold text-white/90">{group.title}</h3>
                    <p className="text-xs text-white/60">{group.subtitle}</p>
                  </div>

                  <div className="mt-3 grid gap-2.5">
                    {group.items.map((item) => (
                      <details key={item.q} className="group rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-base font-semibold text-white">
                          <span>{item.q}</span>
                          <span className="text-xs font-medium text-white/60 group-open:hidden">Expand</span>
                          <span className="hidden text-xs font-medium text-cyan-100/85 group-open:inline">Collapse</span>
                        </summary>
                        <p className="mt-2 text-sm leading-relaxed text-white/75">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </main>

        <aside className="fixed inset-x-0 bottom-3 z-50 px-4">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-2xl border border-cyan-300/30 bg-neutral-950/75 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-white/90">
              We onboard a limited number of new clients each month to maintain service quality.
            </p>
            <div className="flex flex-wrap gap-2">
                <a
                  href="#build-plan"
                  className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
                >
                Schedule a FREE Assessment
                </a>
              <a
                href="tel:8064849040"
                className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/5"
              >
                Call
              </a>
              <a
                href="mailto:info@lonestarglobaltech.com"
                className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/5"
              >
                Email
              </a>
            </div>
          </div>
        </aside>

        <BrandFooter />
      </div>
    </div>
  );
}
