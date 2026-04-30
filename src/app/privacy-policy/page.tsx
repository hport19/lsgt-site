import Link from "next/link";
import { BrandBackdrop, BrandFooter, BrandHeader } from "@/src/components/site/brand-shell";
import { ContactRow, LegalHero, LegalSection, LegalSubSection } from "@/src/components/legal/legal-primitives";

const LAST_UPDATED = "February 28, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen text-neutral-100">
      <BrandBackdrop />

      <div className="relative z-10">
        <BrandHeader
          subtitle="Privacy, Compliance, and Security"
          nav={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/#services" },
            { label: "Why Us", href: "/#why-us" },
            { label: "Managed IT", href: "/msp" },
            { label: "Providers", href: "/careers" },
            { label: "Privacy", href: "/privacy-policy", active: true },
          ]}
        />

        <LegalHero
          badge="Legal • Privacy"
          title="Privacy Policy"
          description="This policy explains how GlobalTech collects, uses, and protects information when you visit our website or submit requests for support, projects, and MSP services."
          lastUpdated={LAST_UPDATED}
        />

        <main className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-6">
            <section data-reveal className="grid gap-4 md:grid-cols-3">
              <div className="ui-card rounded-3xl p-5">
                <h2 className="text-sm font-semibold">No data selling</h2>
                <p className="mt-2 text-sm text-white/65">We do not sell, rent, or trade your personal information.</p>
              </div>
              <div className="ui-card rounded-3xl p-5">
                <h2 className="text-sm font-semibold">Security-first operations</h2>
                <p className="mt-2 text-sm text-white/65">We apply reasonable safeguards designed to reduce data misuse and abuse.</p>
              </div>
              <div className="ui-card rounded-3xl p-5">
                <h2 className="text-sm font-semibold">Purpose-driven processing</h2>
                <p className="mt-2 text-sm text-white/65">We use data to respond to requests, deliver services, and improve reliability.</p>
              </div>
            </section>

            <LegalSection title="1. Information We Collect">
              <p>
                We may collect information you provide directly when you submit a request and limited technical data collected
                automatically when you browse our website.
              </p>

              <LegalSubSection title="a) Information you provide">
                <ul className="grid gap-2 text-sm text-white/75">
                  <li>• Name</li>
                  <li>• Email address</li>
                  <li>• Phone number</li>
                  <li>• Company name</li>
                  <li>• Message content and request details (Support / Project / MSP)</li>
                </ul>
              </LegalSubSection>

              <LegalSubSection title="b) Automatically collected information">
                <ul className="grid gap-2 text-sm text-white/75">
                  <li>• IP address</li>
                  <li>• Browser type and version</li>
                  <li>• Device type and operating system</li>
                  <li>• Pages visited and time spent on site</li>
                </ul>
              </LegalSubSection>
            </LegalSection>

            <LegalSection title="2. How We Use Your Information">
              <p>
                We use collected information to route and respond to your requests, operate our services, and improve the
                performance and security of our website.
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-white/75">
                <li>• Respond to support tickets, project inquiries, and MSP onboarding requests</li>
                <li>• Route communications to the correct team (Support, Sales, or MSP)</li>
                <li>• Contact you about your request via email, phone call, or voicemail</li>
                <li>• Improve service reliability and operational quality</li>
                <li>• Prevent fraud, abuse, spam, or malicious activity</li>
              </ul>
              <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-950/30 p-4 text-sm text-white/70">
                <span className="font-semibold text-white/85">We do not sell</span> your personal information.
              </div>
            </LegalSection>

            <LegalSection title="3. Communications">
              <p>
                If you submit a request or contact us, you consent to receiving communications related to your inquiry. These
                communications may be by email, phone call, or voicemail.
              </p>
              <p className="mt-3 text-sm text-white/65">
                We do not send unrelated marketing messages without a lawful basis.
              </p>
            </LegalSection>

            <LegalSection title="4. Data Security">
              <p>
                We use reasonable safeguards designed to protect your information. No method of transmission over the internet
                is fully secure, and we cannot guarantee absolute security.
              </p>
            </LegalSection>

            <LegalSection title="5. Third-Party Services">
              <p>
                We may use trusted third-party providers to operate our website and communications, including hosting, email
                delivery, monitoring, and security tooling. Providers receive only the data needed to perform their services.
              </p>
            </LegalSection>

            <LegalSection title="6. Cookies & Tracking">
              <p>
                We avoid invasive advertising trackers. We may use minimal essential cookies or analytics to understand site
                performance and improve reliability.
              </p>
            </LegalSection>

            <LegalSection title="7. Data Retention">
              <p>
                We retain information only as long as needed to fulfill the purposes in this policy or to meet legal,
                regulatory, and operational requirements.
              </p>
            </LegalSection>

            <LegalSection title="8. Your Rights">
              <p>
                Depending on your location, you may request access, correction, or deletion of your personal information. To
                make a request, contact us using the details below.
              </p>
            </LegalSection>

            <LegalSection title="9. Children’s Privacy">
              <p>
                Our services are not directed to children under 13, and we do not knowingly collect personal information from
                children.
              </p>
            </LegalSection>

            <LegalSection title="10. Contact Information">
              <div className="grid gap-4 md:grid-cols-2">
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
                    <ContactRow label="Phone" value="(806) 484-9040" />
                    <ContactRow label="General" value="info@lonestarglobaltech.com" />
                    <ContactRow label="Support" value="support@lonestarglobaltech.com" />
                    <ContactRow label="Sales" value="sales@lonestarglobaltech.com" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/#contact"
                      className="inline-flex rounded-xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-white/90"
                    >
                      Open Ticket
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/[0.07]"
                    >
                      Return Home
                    </Link>
                  </div>
                </div>
              </div>
            </LegalSection>

            <LegalSection title="11. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
              </p>
            </LegalSection>

            <section data-reveal className="ui-panel rounded-3xl p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Need support or planning help?</h2>
                  <p className="mt-1 text-sm text-white/65">Open a request and we route it directly to the right team.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/#contact"
                    className="inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
                  >
                    Schedule a FREE Assessment
                  </Link>
                  <Link
                    href="tel:8064849040"
                    className="inline-flex rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.07]"
                  >
                    Call
                  </Link>
                  <Link
                    href="mailto:info@lonestarglobaltech.com"
                    className="inline-flex rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.07]"
                  >
                    Email
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>

        <BrandFooter />
      </div>
    </div>
  );
}
