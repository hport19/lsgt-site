"use client";

import React, { useEffect } from "react";

export default function TermsAndConditionsPage() {
  useEffect(() => {
    // If you want to force dark background behavior or analytics hooks later, this is a safe spot.
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const goHome = () => {
    window.location.href = "/";
  };

  const goToHomeSection = (id: string) => {
    window.location.href = `/#${id}`;
  };

  const lastUpdated = "January 15, 2026";

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-[-220px] right-[-140px] h-[560px] w-[560px] rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="relative">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <button
              type="button"
              onClick={goHome}
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.07]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/90 group-hover:bg-white/15">
                GT
              </span>
              <span className="leading-tight">
                <span className="block">GlobalTech</span>
                <span className="block text-xs font-medium text-white/55">DBA of Lone Star GlobalTech</span>
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => (window.location.href = "/privacy-policy")}
                className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/[0.07] md:inline-flex"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => goToHomeSection("contact")}
                className="inline-flex rounded-xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-white/90"
              >
                Contact
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          {/* Title */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs font-semibold text-white/55">Legal</div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  Terms &amp; Conditions
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                  These Terms govern your access to and use of the GlobalTech website, communications, and related
                  services. If you do not agree, please do not use our services.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-950/30 px-4 py-3 text-sm text-white/70">
                <div className="text-xs font-semibold text-white/55">Last updated</div>
                <div className="mt-1 font-semibold text-white/85">{lastUpdated}</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mt-8 grid gap-6">
            <Section title="1. Who We Are">
              <p>
                “GlobalTech” is a DBA of Lone Star GlobalTech, LLC (“we,” “us,” “our”). We provide technology services
                such as managed IT, network/security, and related support.
              </p>
              <p className="mt-3 text-sm text-white/65">
                Texas Private Security License: <span className="text-white/80">B30867701</span>
              </p>
            </Section>

            <Section title="2. Acceptance of These Terms">
              <p>
                By accessing or using our website or services, you agree to these Terms and our{" "}
                <a
                  href="/privacy-policy"
                  className="font-semibold text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <Sub title="If you’re using services for a business">
                <p>
                  You represent you have authority to bind that business to these Terms. If a separate written agreement
                  exists (MSA/SOW), that agreement controls where there is a conflict.
                </p>
              </Sub>
            </Section>

            <Section title="3. Use of the Website">
              <p>
                You may use our website for lawful purposes only. You agree not to interfere with site operation, attempt
                unauthorized access, or use the site to distribute malware, spam, or abusive content.
              </p>
              <Sub title="Prohibited activities include">
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Probing/scanning for vulnerabilities without written permission.</li>
                  <li>Attempting to bypass security measures or authentication.</li>
                  <li>Automated scraping that degrades site performance.</li>
                  <li>Using our services for unlawful, fraudulent, or deceptive activity.</li>
                </ul>
              </Sub>
            </Section>

            <Section title="4. Quotes, Orders, and Service Requests">
              <p>
                Any quote, estimate, or scope is non-binding until accepted in writing by both parties. Timelines,
                availability, and pricing may change due to supply chain, vendor changes, or scope adjustments.
              </p>
              <Sub title="Support requests">
                <p>
                  Requests submitted via forms, email, phone, or SMS are triaged and may be routed to Support or Sales.
                  Emergency response is not guaranteed unless explicitly included in a service agreement.
                </p>
              </Sub>
            </Section>

            <Section title="5. SMS & Communications Consent (Important)">
              <p>
                If you text us, call us, or submit a request, you consent to receiving communications related to your
                inquiry. Communications may include email, phone calls, voicemail, and SMS.
              </p>
              <Sub title="Messaging compliance">
                <p>
                  Message frequency may vary. Standard message & data rates may apply. You can opt out of SMS at any time
                  by replying <span className="font-semibold text-white/85">STOP</span>. For help, reply{" "}
                  <span className="font-semibold text-white/85">HELP</span>.
                </p>
              </Sub>
              <Sub title="No spam">
                <p>
                  We do not use SMS to send unrelated marketing without a lawful basis and appropriate consent.
                </p>
              </Sub>
            </Section>

            <Section title="6. Intellectual Property">
              <p>
                The website, branding, text, graphics, and underlying code are owned by GlobalTech or licensors and are
                protected by applicable laws. You may not copy, modify, distribute, or create derivative works without
                written permission, except as allowed by law.
              </p>
            </Section>

            <Section title="7. Third-Party Services and Links">
              <p>
                Our site or services may reference third-party products or websites. We are not responsible for the
                content, policies, or practices of third parties. Your use of third-party services is at your own risk.
              </p>
            </Section>

            <Section title="8. Disclaimers">
              <p>
                The website and any general information provided is offered on an “as is” and “as available” basis, to
                the maximum extent permitted by law. We do not warrant uninterrupted or error-free operation.
              </p>
              <Sub title="No professional advice">
                <p>
                  Information on the site is general and not legal, financial, or compliance advice. For regulated topics,
                  consult qualified professionals.
                </p>
              </Sub>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, GlobalTech will not be liable for indirect, incidental, special,
                consequential, or punitive damages, including lost profits, lost data, or business interruption.
              </p>
              <p className="mt-3">
                If liability is found, our aggregate liability will not exceed the amount paid by you to GlobalTech for
                the services giving rise to the claim within the three (3) months prior to the event, unless a separate
                written agreement states otherwise.
              </p>
            </Section>

            <Section title="10. Indemnification">
              <p>
                You agree to defend, indemnify, and hold harmless GlobalTech and its affiliates from claims arising out of
                your misuse of the website, violation of these Terms, or infringement of third-party rights.
              </p>
            </Section>

            <Section title="11. Governing Law">
              <p>
                These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles.
                Venue for disputes will be in the appropriate courts located in Texas, unless a separate written agreement
                provides otherwise.
              </p>
            </Section>

            <Section title="12. Changes to These Terms">
              <p>
                We may update these Terms from time to time. Updates will be posted on this page with a revised “Last
                updated” date.
              </p>
            </Section>

            <Section title="13. Contact Information">
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-semibold text-white/55">Business</div>
                  <div className="mt-2 text-sm text-white/75">
                    <div className="font-semibold text-white/90">GlobalTech</div>
                    <div className="text-white/60">DBA of Lone Star GlobalTech</div>
                    <div className="mt-2 text-white/60">
                      Texas Private Security License: <span className="text-white/80">B30867701</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-semibold text-white/55">Direct contact</div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <Row label="Phone" value="(806) 484-9040" />
                    <Row label="General" value="info@lonestarglobaltech.com" />
                    <Row label="Support" value="support@lonestarglobaltech.com" />
                    <Row label="Sales" value="sales@lonestarglobaltech.com" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => goToHomeSection("contact")}
                      className="inline-flex rounded-xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-white/90"
                    >
                      Open request form
                    </button>
                    <button
                      type="button"
                      onClick={goHome}
                      className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/[0.07]"
                    >
                      Return home
                    </button>
                  </div>
                </div>
              </div>
            </Section>

            {/* Footer CTA */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-semibold">Need help or planning a project?</div>
                  <div className="mt-1 text-sm text-white/65">
                    Open a request and we’ll route it to Support or Sales automatically.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => goToHomeSection("contact")}
                    className="inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-400"
                  >
                    Go to contact
                  </button>
                  <button
                    type="button"
                    onClick={goHome}
                    className="inline-flex rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/[0.07]"
                  >
                    Return home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom footer consistent vibe */}
        <footer className="border-t border-white/10">
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

            <div className="flex flex-wrap gap-4">
              <button className="hover:text-white" type="button" onClick={goHome}>
                Home
              </button>
              <button className="hover:text-white" type="button" onClick={() => (window.location.href = "/#solutions")}>
                Solutions
              </button>
              <button className="hover:text-white" type="button" onClick={() => (window.location.href = "/#projects")}>
                Projects
              </button>
              <button className="hover:text-white" type="button" onClick={() => (window.location.href = "/#contact")}>
                Contact
              </button>
              <button
                className="hover:text-white"
                type="button"
                onClick={() => (window.location.href = "/privacy-policy")}
              >
                Privacy
              </button>
              <button
                className="hover:text-white"
                type="button"
                onClick={() => (window.location.href = "/terms-and-conditions")}
              >
                Terms
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.20)]">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
      <div className="text-sm font-semibold text-white/85">{title}</div>
      <div className="mt-2 text-sm text-white/70">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-white/85">{value}</span>
    </div>
  );
}