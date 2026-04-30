import Image from "next/image";
import Link from "next/link";
import { CtaLink, SiteContainer } from "@/src/components/site/ui-system";
import { CTA, SITE } from "@/src/lib/site-config";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Managed IT", href: "/msp" },
  { label: "Services", href: "/#services" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Providers", href: "/careers" },
];

export function BrandBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(1300px_760px_at_14%_8%,rgba(59,130,246,0.24),rgba(59,130,246,0.14)_34%,rgba(59,130,246,0.05)_62%,transparent_82%),radial-gradient(1100px_700px_at_86%_18%,rgba(56,189,248,0.2),rgba(56,189,248,0.1)_34%,rgba(56,189,248,0.03)_60%,transparent_80%),linear-gradient(160deg,rgba(2,10,26,0.94),rgba(2,8,23,0.98)_58%,rgba(1,7,18,1)_100%)]" />
      <div className="absolute inset-0 lsgt-grid opacity-[0.14]" />
      <div className="absolute inset-0 lsgt-grain opacity-[0.16]" />
    </div>
  );
}

export function BrandHeader({
  subtitle = "Friendly IT support for growing teams",
  nav = DEFAULT_NAV,
}: {
  subtitle?: string;
  nav?: NavItem[];
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/55 backdrop-blur">
      <SiteContainer className="py-3 lg:max-w-[92rem] lg:py-4">
        <div className="ui-nav-shell rounded-2xl px-3 py-2 md:px-4 lg:px-5 lg:py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="inline-flex items-center gap-3 text-white/92 transition hover:text-white">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/12 bg-white/5">
                <Image src="/isotipo.png" alt="GlobalTech logo" fill className="object-contain p-1" sizes="40px" priority />
              </div>
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">{SITE.brand}</div>
                <div className="text-xs text-white/55">{subtitle}</div>
              </div>
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-2 text-sm lg:flex xl:gap-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ui-nav-link ${item.active ? "ui-nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <CtaLink href="/msp#quick-plan" variant="primary" className="px-4 py-2 text-xs md:text-sm lg:px-6 lg:py-2.5 lg:text-sm">
                {CTA.quickPlan}
              </CtaLink>
              <CtaLink href={SITE.phoneHref} variant="ghost" className="px-3 py-2 text-xs md:text-sm lg:px-4 lg:py-2.5">
                Call
              </CtaLink>
              <CtaLink href={SITE.emailHref} variant="ghost" className="px-3 py-2 text-xs md:text-sm lg:px-4 lg:py-2.5">
                Email
              </CtaLink>
            </div>
          </div>
        </div>
      </SiteContainer>
    </header>
  );
}

export function BrandFooter() {
  return (
    <footer className="border-t border-white/10">
      <SiteContainer className="py-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-white/65 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p>© {new Date().getFullYear()} {SITE.brand} (DBA of {SITE.legalName})</p>
              <p className="mt-1 text-xs text-white/45">Texas Private Security License: {SITE.dpsLicense}</p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
                <Link href="/msp" className="hover:text-white">
                  Managed IT
                </Link>
                <Link href="/careers" className="hover:text-white">
                  Providers
                </Link>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="hover:text-white">
                  Terms &amp; Conditions
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/lonestarglobaltech"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Open Facebook"
                  title="Facebook"
                >
                  <Image src="/facebook.png" alt="Facebook" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
                </a>
                <a
                  href="https://www.linkedin.com/company/lone-star-globaltech?trk=profile-position"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Open LinkedIn"
                  title="LinkedIn"
                >
                  <Image src="/linkedin.png" alt="LinkedIn" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
                </a>
                <a
                  href="https://share.google/eBefco64FqxeL9EhM"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Open Google Business"
                  title="Google"
                >
                  <Image src="/google.png" alt="Google Business" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}
