"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CTA, SITE } from "@/src/lib/site-config";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Managed IT", href: "/msp" },
  { label: "Services", href: "/#solutions" },
  { label: "Why Us", href: "/#why" },
  { label: "Projects", href: "/#projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#contact" },
];

export function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_680px_at_12%_8%,rgba(14,165,233,0.22),transparent_58%),radial-gradient(920px_600px_at_88%_12%,rgba(20,184,166,0.16),transparent_58%),linear-gradient(160deg,rgba(3,10,24,0.96),rgba(6,18,32,0.98)_58%,rgba(3,7,18,1))]" />
      <div className="absolute inset-0 lsgt-grid opacity-[0.12]" />
      <div className="absolute inset-0 lsgt-grain opacity-[0.13]" />
    </div>
  );
}

function navItemActive(pathname: string, href: string, active?: "home" | "msp" | "careers" | "sales") {
  if (active === "msp" && href === "/msp") return true;
  if (active === "careers" && href === "/careers") return true;
  if (active === "sales" && href === "/sales") return true;
  if (pathname === "/msp" && href === "/msp") return true;
  if (pathname === "/careers" && href === "/careers") return true;
  if (pathname === "/sales" && href === "/sales") return true;
  return false;
}

export function SiteHeader({ active }: { active?: "home" | "msp" | "careers" | "sales" }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/58 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 lg:max-w-[92rem] lg:py-4">
        <div className="ui-nav-shell rounded-2xl px-3 py-2 lg:px-5 lg:py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/80 transition hover:bg-white/5 lg:hidden"
                aria-label="Toggle navigation"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
              </button>
              <Link href="/" className="inline-flex min-w-0 items-center gap-3 text-white/92 transition hover:text-white">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/12 bg-white/5">
                  <Image src="/isotipo.png" alt="GlobalTech logo" fill className="object-contain p-1" sizes="40px" priority />
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="font-semibold tracking-tight">{SITE.brand}</div>
                  <div className="hidden text-xs text-white/58 sm:block">DBA of Lone Star GlobalTech • Premium MSP • Security • Infrastructure</div>
                </div>
              </Link>
            </div>

            <nav aria-label="Main" className="hidden items-center gap-1 text-sm text-white/74 lg:flex xl:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ui-nav-link ${navItemActive(pathname, item.href, active) ? "ui-nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/sales"
                data-analytics-id="header-quick-plan"
                className={`inline-flex rounded-xl border border-cyan-300/35 bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_12px_34px_rgba(34,211,238,0.22)] transition hover:bg-cyan-400 lg:px-6 lg:py-2.5 lg:text-sm ${
                  active === "sales" || pathname === "/sales" ? "ring-2 ring-cyan-200/40" : ""
                }`}
              >
                {CTA.quickPlan}
              </Link>
              <a
                href={SITE.phoneHref}
                data-analytics-id="header-phone"
                className="inline-flex rounded-xl border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                Call
              </a>
              <a
                href={SITE.emailHref}
                data-analytics-id="header-email"
                className="hidden rounded-xl border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 md:inline-flex lg:px-4 lg:py-2.5 lg:text-sm"
              >
                Email
              </a>
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileOpen ? "max-h-96 pt-3 opacity-100" : "max-h-0 pt-0 opacity-0"}`}>
            <nav aria-label="Mobile main" className="grid gap-2 border-t border-white/10 pt-3 text-sm text-white/80">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl border border-white/10 px-4 py-2 transition hover:bg-white/5 ${
                    navItemActive(pathname, item.href, active) ? "bg-white/8 text-white" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a href={SITE.emailHref} onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 px-4 py-2 transition hover:bg-white/5 md:hidden">
                Email
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export function DpsTrustBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-emerald-300/25 bg-emerald-950/18 p-4 text-sm text-emerald-50/86">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" aria-hidden="true" />
        <div>
          <div className="font-semibold text-white">Texas DPS Private Security License</div>
          <p className={compact ? "mt-1 text-xs leading-relaxed text-emerald-50/72" : "mt-1 leading-relaxed text-emerald-50/76"}>
            Licensed by Texas DPS for security-related services. That means a higher standard of accountability when your IT,
            cameras, access, and security needs overlap.
          </p>
          <p className="mt-2 text-xs font-semibold text-emerald-100/80">License: {SITE.dpsLicense}</p>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/64">
        <div className="grid gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="font-semibold text-white/82">{SITE.brand} (DBA of {SITE.legalName})</p>
            <p className="mt-1 max-w-2xl text-white/58">
              Managed IT, security-aware support, networks, phones, cameras, and infrastructure for small and medium businesses.
            </p>
            <p className="mt-2 text-xs text-white/45">Texas Private Security License: {SITE.dpsLicense}</p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/msp" className="hover:text-white">
                MSP
              </Link>
              <Link href="/careers" className="hover:text-white">
                Careers
              </Link>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white">
                Terms
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/lonestarglobaltech"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 transition hover:bg-white/10"
                aria-label="Open Facebook"
                title="Facebook"
              >
                <Image src="/facebook.png" alt="Facebook" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
              </a>
              <a
                href="https://www.linkedin.com/company/lone-star-globaltech?trk=profile-position"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 transition hover:bg-white/10"
                aria-label="Open LinkedIn"
                title="LinkedIn"
              >
                <Image src="/linkedin.png" alt="LinkedIn" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
              </a>
              <a
                href="https://share.google/eBefco64FqxeL9EhM"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-3 py-2 transition hover:bg-white/10"
                aria-label="Open Google Business"
                title="Google"
              >
                <Image src="/google.png" alt="Google Business" width={18} height={18} className="opacity-80 transition group-hover:opacity-100" />
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={SITE.phoneHref} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/82 hover:bg-white/8">
                {SITE.phone}
              </a>
              <a href={SITE.emailHref} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/82 hover:bg-white/8">
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
