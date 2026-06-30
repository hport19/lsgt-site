import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Headset,
  HeartHandshake,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PageBackdrop, SiteFooter, SiteHeader } from "@/src/components/site/conversion-shell";
import ProviderApplicationForm from "./provider-application-form";

export const metadata: Metadata = {
  title: "Careers | GlobalTech",
  description:
    "Join GlobalTech and help build the future of managed IT, field services, networking, security, and business technology across Texas.",
  alternates: {
    canonical: "/careers",
  },
};

const traits = [
  { icon: Wrench, title: "Solve problems", text: "You move toward the issue and figure out the next practical step." },
  { icon: MessageSquare, title: "Communicate clearly", text: "Customers should never feel lost, ignored, or talked down to." },
  { icon: HeartHandshake, title: "Care about customers", text: "The work matters because real businesses depend on it." },
  { icon: ShieldCheck, title: "Take ownership", text: "You finish cleanly, document well, and follow through." },
  { icon: Sparkles, title: "Keep learning", text: "Technology changes. Good people stay curious." },
] as const;

const paths = [
  {
    icon: HeartHandshake,
    title: "Relationship Builder",
    description:
      "Build relationships with business owners, schedule appointments, follow up, and represent GlobalTech professionally.",
    note: "Focused on trust, relationships, and opening doors, not aggressive selling.",
    responsibilities: ["Business outreach", "Appointment setting", "Relationship building", "Follow-up", "CRM updates"],
  },
  {
    icon: Network,
    title: "Field Technician",
    description:
      "Install, repair, deploy, troubleshoot, and travel to customer sites for networking, cameras, phones, low voltage, and infrastructure work.",
    note: "Hands-on work for people who like solving real problems in the field.",
    responsibilities: ["Network installations", "Camera systems", "Cabling", "Troubleshooting", "Hardware deployment"],
  },
  {
    icon: Headset,
    title: "Technical Support Agent",
    description:
      "Support remote users, helpdesk requests, managed IT operations, Microsoft 365, endpoint management, and customer success.",
    note: "Calm, clear support for people who need technology to just work.",
    responsibilities: ["Helpdesk", "Remote troubleshooting", "Microsoft 365", "Endpoint management", "Documentation"],
  },
] as const;

const culture = [
  "You won't disappear into a giant corporation.",
  "You'll work directly with experienced technicians.",
  "You'll solve real business problems.",
  "You'll continue learning.",
  "You'll own your work.",
  "You'll build long-term customer relationships.",
] as const;

export default function CareersPage() {
  return (
    <div className="relative min-h-screen text-neutral-100">
      <PageBackdrop />
      <div className="relative z-10">
        <SiteHeader active="careers" />

        <main>
          <section data-analytics-section="careers-hero" data-reveal className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-10 md:grid-cols-[1.02fr_0.98fr] md:items-center md:pb-18 md:pt-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-950/24 px-3 py-1.5 text-xs font-semibold text-cyan-50/86">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Build with standards
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[0.01em] md:text-6xl">
                Build the IT company you always wished existed.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/74">
                GlobalTech is a small, ambitious team building a higher standard for managed IT, field services,
                networking, security, and customer relationships across Texas.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#opportunities"
                  data-analytics-id="careers-view-opportunities"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-400"
                >
                  View Opportunities
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#apply"
                  data-analytics-id="careers-apply-hero"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white/90 transition duration-300 hover:-translate-y-0.5 hover:bg-white/7"
                >
                  Apply to GlobalTech
                </Link>
              </div>
            </div>

            <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45">
              <Image
                src="/media/external/msp-ops-team.jpg"
                alt="GlobalTech team working on business technology operations"
                fill
                priority
                className="object-cover opacity-82"
                sizes="(max-width: 768px) 100vw, 48vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.84),rgba(3,7,18,0.14))]" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/12 bg-black/38 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">Great IT doesn&apos;t happen by accident.</p>
                <p className="mt-1 text-sm text-white/68">Great teams build it with ownership, clarity, and care.</p>
              </div>
            </div>
          </section>

          <section data-analytics-section="careers-standards" data-reveal className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Who we are looking for</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Not just resumes. Standards.</h2>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-5">
                {traits.map((trait, index) => {
                  const Icon = trait.icon;
                  return (
                    <article
                      key={trait.title}
                      data-reveal
                      style={{ transitionDelay: `${index * 55}ms` }}
                      className="rounded-3xl border border-white/10 bg-slate-950/36 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/24 hover:bg-white/[0.055]"
                    >
                      <Icon className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                      <h3 className="mt-4 text-lg font-semibold">{trait.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{trait.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="opportunities" data-analytics-section="careers-paths" data-reveal className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:scroll-mt-32">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Career paths</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Choose the kind of impact you want to make.</h2>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {paths.map((path, index) => {
                const Icon = path.icon;
                return (
                  <article
                    key={path.title}
                    data-reveal
                    style={{ transitionDelay: `${index * 70}ms` }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/24 hover:shadow-[0_30px_90px_rgba(34,211,238,0.1)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Icon className="h-8 w-8 text-cyan-200" aria-hidden="true" />
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/56">Path {index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold">{path.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/68">{path.description}</p>
                    <p className="mt-4 rounded-2xl border border-cyan-300/16 bg-cyan-950/14 p-3 text-sm font-medium text-cyan-50/78">{path.note}</p>
                    <ul className="mt-5 grid gap-2 text-sm text-white/66">
                      {path.responsibilities.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section data-analytics-section="careers-why" data-reveal className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.92fr_1.08fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Why GlobalTech</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">A smaller team. Higher ownership.</h2>
                <p className="mt-4 leading-relaxed text-white/70">
                  We are building a company where technical quality and human trust belong together. That takes people
                  who care about the customer, the details, and the long-term relationship.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {culture.map((item, index) => (
                  <div
                    key={item}
                    data-reveal
                    style={{ transitionDelay: `${index * 55}ms` }}
                    className="rounded-2xl border border-white/10 bg-slate-950/36 px-4 py-4 text-sm font-medium text-white/72"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="apply" data-analytics-section="careers-application" data-reveal className="mx-auto grid max-w-6xl scroll-mt-28 gap-8 px-4 py-16 md:grid-cols-[0.82fr_1.18fr] md:items-start md:scroll-mt-32">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Apply</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">Apply to GlobalTech</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Tell us about yourself, choose the path that fits you best, and upload your resume. We review every application personally.
              </p>
              <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-950/16 p-5 text-emerald-50/82">
                <ShieldCheck className="h-7 w-7 text-emerald-200" aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold">We hire for character first.</p>
                <p className="mt-2 text-sm leading-relaxed text-emerald-50/72">
                  Skills can be taught. Integrity cannot.
                </p>
              </div>
            </div>
            <ProviderApplicationForm />
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
