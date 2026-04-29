import { CtaLink, siteTypography } from "@/src/components/site/ui-system";

export function LegalHero({
  badge,
  title,
  description,
  lastUpdated,
}: {
  badge: string;
  title: string;
  description: string;
  lastUpdated: string;
}) {
  return (
    <section data-reveal className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="ui-panel rounded-3xl p-6 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
              {badge}
            </div>

            <h1 className={`${siteTypography.h1} mt-4 md:text-5xl`}>{title}</h1>
            <p className={`${siteTypography.body} mt-3 max-w-2xl`}>{description}</p>

            <div className="mt-4 text-xs text-white/55">
              <span className="font-semibold text-white/70">Last updated:</span> {lastUpdated}
            </div>
          </div>

          <div className="grid gap-2 md:pt-1">
            <CtaLink href="/#contact" variant="primary">
              Schedule a FREE Assessment
            </CtaLink>
            <div className="flex flex-wrap gap-2">
              <CtaLink href="tel:8064849040" variant="ghost" className="px-4 py-2 text-xs">
                Call
              </CtaLink>
              <CtaLink href="mailto:info@lonestarglobaltech.com" variant="ghost" className="px-4 py-2 text-xs">
                Email
              </CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section data-reveal className="ui-panel rounded-3xl p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export function LegalSubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
      <h3 className="text-sm font-semibold text-white/85">{title}</h3>
      <div className="mt-2 text-sm text-white/70">{children}</div>
    </div>
  );
}

export function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-white/85">{value}</span>
    </div>
  );
}
