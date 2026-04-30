import type { Metadata } from "next";
import { BriefcaseBusiness, GraduationCap, HeartHandshake, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { PageBackdrop, SiteFooter, SiteHeader } from "@/src/components/site/conversion-shell";
import ProviderApplicationForm from "./provider-application-form";

export const metadata: Metadata = {
  title: "Join Our Network of Technology Providers",
  description:
    "Apply to join Lone Star GlobalTech's independent provider network. Field technician opportunities for IT students, entry-level techs, and independent technology providers.",
  alternates: {
    canonical: "/careers",
  },
};

const reasons = [
  { icon: GraduationCap, title: "Gain real field experience", text: "Support real projects while learning how professional site work, documentation, and customer communication happen." },
  { icon: HeartHandshake, title: "Guidance and process", text: "You are not thrown into work without context. We value preparation, communication, and steady improvement." },
  { icon: Wrench, title: "Tools should not block you", text: "Lack of tools does not automatically disqualify someone. Be honest about what you have and what you are learning." },
] as const;

const workTypes = [
  "Desktop and basic helpdesk support",
  "Network, Wi-Fi, and device troubleshooting",
  "Structured cabling support",
  "Camera and low-voltage project assistance",
  "Site surveys, photos, documentation, and closeout notes",
  "User setup, equipment swaps, and field dispatch support",
] as const;

export default function CareersPage() {
  return (
    <div className="relative min-h-screen text-neutral-100">
      <PageBackdrop />
      <div className="relative z-10">
        <SiteHeader active="careers" />

        <main>
          <section data-analytics-section="careers-hero" className="mx-auto max-w-6xl px-4 pb-12 pt-10 md:pb-16 md:pt-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-950/24 px-3 py-1.5 text-xs font-semibold text-cyan-50/86">
                <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                Independent provider network
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[0.01em] md:text-6xl">
                Join Our Network of Technology Providers
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/74">
                Lone Star GlobalTech works with skilled and growing technicians who want real field experience, clear expectations,
                and opportunities to support customers professionally. These are independent provider opportunities, not employee positions.
              </p>
            </div>
          </section>

          <section data-analytics-section="careers-reasons" className="border-y border-white/10 bg-white/[0.035]">
            <div className="mx-auto max-w-6xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Why work with us</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em] md:text-4xl">A practical path for technicians who want to grow.</h2>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {reasons.map((reason) => {
                  const Icon = reason.icon;
                  return (
                    <article key={reason.title} className="rounded-3xl border border-white/10 bg-slate-950/36 p-6">
                      <Icon className="h-7 w-7 text-cyan-200" aria-hidden="true" />
                      <h3 className="mt-4 text-xl font-semibold">{reason.title}</h3>
                      <p className="mt-2 leading-relaxed text-white/67">{reason.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section data-analytics-section="careers-fit" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">What providers may support</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em]">Field work, customer support, and hands-on technology tasks.</h2>
              <div className="mt-6 grid gap-3">
                {workTypes.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/74">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <MapPin className="h-7 w-7 text-cyan-200" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-semibold">Who we are looking for</h2>
              <p className="mt-3 leading-relaxed text-white/68">
                IT students, entry-level technicians, reliable independent techs, and people who care about learning, showing up,
                communicating clearly, and treating customers well.
              </p>
              <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-950/16 p-4 text-sm text-emerald-50/76">
                <div className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" aria-hidden="true" />
                  <span>Professionalism, reliability, learning mindset, and customer service matter as much as technical experience.</span>
                </div>
              </div>
            </div>
          </section>

          <section data-analytics-section="careers-application" className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-[0.82fr_1.18fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">Apply</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[0.01em]">Tell us where you are and what you want to support.</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Be honest about your experience, tools, transportation, and availability. We are looking for dependable providers
                who want to do solid work and keep learning.
              </p>
            </div>
            <ProviderApplicationForm />
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
