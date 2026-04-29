import Link from "next/link";
import { BrandBackdrop, BrandFooter, BrandHeader } from "@/src/components/site/brand-shell";
import { ContactRow, LegalHero, LegalSection, LegalSubSection } from "@/src/components/legal/legal-primitives";

const LAST_UPDATED = "February 28, 2026";

export default function TermsAndConditionsPage() {
  return (
    <div className="relative min-h-screen text-neutral-100">
      <BrandBackdrop />

      <div className="relative z-10">
        <BrandHeader
          subtitle="Legal Terms and Service Conditions"
          nav={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/#solutions" },
            { label: "Projects", href: "/#projects" },
            { label: "MSP Plans", href: "/msp" },
            { label: "Terms", href: "/terms-and-conditions", active: true },
          ]}
        />

        <LegalHero
          badge="Legal • Terms"
          title="Terms & Conditions"
          description="These terms govern access to the GlobalTech website, communications, and managed services. By using our site or contacting us, you agree to these terms."
          lastUpdated={LAST_UPDATED}
        />

        <main className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-6">
            <LegalSection title="1. Acceptance of Terms">
              <p>
                By accessing or using our website, submitting a request, or engaging our services, you agree to these Terms
                and our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <LegalSubSection title="Authority to bind a business">
                <p>
                  If you are using our services on behalf of a company, you represent that you have authority to bind that
                  company to these Terms.
                </p>
              </LegalSubSection>
            </LegalSection>

            <LegalSection title="2. Services Provided">
              <p>
                GlobalTech provides managed IT, cybersecurity, infrastructure, low-voltage, and related technology services.
                Specific scope, timelines, and deliverables are confirmed in writing when a proposal or agreement is accepted.
              </p>
            </LegalSection>

            <LegalSection title="3. Use of Website">
              <p>
                You agree to use the website for lawful purposes only and not to disrupt, interfere with, or attempt
                unauthorized access to systems or data.
              </p>
              <LegalSubSection title="Prohibited activities">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Attempting to bypass security measures or authentication.</li>
                  <li>Introducing malware, spam, or abusive content.</li>
                  <li>Automated scraping that materially impacts site performance.</li>
                </ul>
              </LegalSubSection>
            </LegalSection>

            <LegalSection title="4. Customer Responsibilities">
              <p>
                You agree to provide accurate contact information, respond to reasonable requests for clarification, and
                maintain appropriate access permissions for requested services.
              </p>
            </LegalSection>

            <LegalSection title="5. Payments and Invoicing">
              <p>
                If services are provided for a fee, pricing and payment terms are defined in the applicable quote, proposal,
                or service agreement. Late payments may result in service delays, suspension, or additional fees.
              </p>
            </LegalSection>

            <LegalSection title="6. Intellectual Property">
              <p>
                Website content, branding, and underlying code are owned by GlobalTech or its licensors and protected by law.
                You may not copy or distribute them without written permission, except where permitted by law.
              </p>
            </LegalSection>

            <LegalSection title="7. Disclaimers">
              <p>
                The website and general information are provided on an &quot;as is&quot; and &quot;as available&quot;
                basis. We do not guarantee uninterrupted or error-free operation, and disclaim warranties to the maximum
                extent permitted by law.
              </p>
            </LegalSection>

            <LegalSection title="8. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, GlobalTech is not liable for indirect, incidental, special,
                consequential, or punitive damages, including lost profits, data, or business interruption.
              </p>
              <p className="mt-3">
                If liability is found, total liability is limited to the amount paid for services giving rise to the claim in
                the three (3) months prior to the event, unless a separate agreement states otherwise.
              </p>
            </LegalSection>

            <LegalSection title="9. Indemnification">
              <p>
                You agree to defend, indemnify, and hold harmless GlobalTech and its affiliates from claims arising from your
                misuse of the website, violation of these terms, or infringement of third-party rights.
              </p>
            </LegalSection>

            <LegalSection title="10. Third-Party Links">
              <p>
                Our website may reference third-party services or websites. We are not responsible for their content,
                policies, or practices, and your use of them is at your own risk.
              </p>
            </LegalSection>

            <LegalSection title="11. Privacy">
              <p>
                We collect and use information as described in our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </LegalSection>

            <LegalSection title="12. Governing Law (Texas, USA)">
              <p>
                These terms are governed by the laws of the State of Texas, United States, without regard to conflict of law
                principles. Venue for disputes will be in the appropriate courts located in Texas.
              </p>
            </LegalSection>

            <LegalSection title="13. Contact Information">
              <p>
                Questions about these terms can be sent to{" "}
                <span className="font-semibold text-white/85">info@lonestarglobaltech.com</span>.
              </p>
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
                    <ContactRow label="Phone" value="(806) 484-9040" />
                    <ContactRow label="General" value="info@lonestarglobaltech.com" />
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
