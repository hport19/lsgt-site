import { PageBackdrop, SiteFooter, SiteHeader } from "@/src/components/site/conversion-shell";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

function inferActive(nav?: NavItem[]): "home" | "msp" | "careers" | "sales" | undefined {
  const activeItem = nav?.find((item) => item.active);

  if (activeItem?.href === "/msp") return "msp";
  if (activeItem?.href === "/careers") return "careers";
  if (activeItem?.href === "/sales") return "sales";
  if (activeItem?.href === "/") return "home";

  return undefined;
}

export function BrandBackdrop() {
  return <PageBackdrop />;
}

export function BrandHeader({ nav }: { subtitle?: string; nav?: NavItem[] }) {
  return <SiteHeader active={inferActive(nav)} />;
}

export function BrandFooter() {
  return <SiteFooter />;
}
