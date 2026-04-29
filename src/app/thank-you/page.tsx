import Link from "next/link";
import { BrandBackdrop, BrandFooter, BrandHeader } from "@/src/components/site/brand-shell";

type ThankYouSearchParams = {
  type?: string;
};

type ThankYouProps = {
  searchParams?: Promise<ThankYouSearchParams>;
};

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const params = (await searchParams) ?? {};
  const type = params.type || "support";

  const isSupport = type === "support";
  const isProject = type === "project";

  const title = isSupport ? "Support Request Received" : isProject ? "Project Request Received" : "MSP Request Received";

  const mainText = isSupport
    ? "Your ticket is in queue and routed for priority triage."
    : isProject
    ? "Your project inquiry is in review. We will reply with scope and next steps."
    : "Your MSP request is in review. We will follow up with a tailored onboarding path.";

  const subText = isSupport
    ? "If this is a critical outage or life-safety event, follow your emergency procedures and call your dedicated support line."
    : "If this request has a hard deadline, reply to our follow-up and include your target date.";

  const secondaryLink = isSupport
    ? { href: "/#contact", label: "Open Another Ticket" }
    : isProject
    ? { href: "/#projects", label: "View Delivered Projects" }
    : { href: "/msp", label: "Compare MSP Plans" };

  const nextSteps = isSupport
    ? [
        "We verify urgency, scope, and environment details.",
        "A real engineer reviews your request before response.",
        "You receive callback/email with next actions.",
      ]
    : [
        "We review your goals, timeline, and constraints.",
        "We map your request to the right solution path.",
        "You receive clear next steps and estimate guidance.",
      ];

  return (
    <div className="relative min-h-screen text-neutral-100">
      <BrandBackdrop />

      <div className="relative z-10 flex min-h-screen flex-col">
        <BrandHeader
          subtitle="Request Confirmation"
          nav={[
            { label: "Home", href: "/" },
            { label: "MSP Plans", href: "/msp" },
            { label: "Confirmation", href: "/thank-you", active: true },
          ]}
        />

        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-12">
          <section data-reveal className="ui-panel w-full rounded-3xl p-6 md:p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-sky-400 shadow-[0_15px_45px_rgba(34,211,238,0.35)]">
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9.00039 16.2002L4.80039 12.0002L3.40039 13.4002L9.00039 19.0002L21.0004 7.0002L19.6004 5.6002L9.00039 16.2002Z"
                  />
                </svg>
              </div>

              <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-white/72">{mainText}</p>
              <p className="mt-4 text-xs text-white/55">{subText}</p>
            </div>

            <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-white/10 bg-neutral-950/30 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">What Happens Next</h2>
              <ul className="mt-4 grid gap-3">
                {nextSteps.map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
                    <span className="text-sm text-white/75">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                Schedule a FREE Assessment
              </Link>

              <Link
                href="tel:8064849040"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Call
              </Link>

              <Link
                href="mailto:info@lonestarglobaltech.com"
                className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-950/20 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-950/30"
              >
                Email
              </Link>
            </div>

            <div className="mx-auto mt-4 flex max-w-2xl justify-center">
              <Link href={secondaryLink.href} className="text-sm text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white">
                {secondaryLink.label}
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-white/45">
              Texas Private Security License: <span className="text-white/65">B30867701</span>
            </p>
          </section>
        </main>

        <BrandFooter />
      </div>
    </div>
  );
}
