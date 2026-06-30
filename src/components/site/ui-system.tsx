import Link from "next/link";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const siteTypography = {
  h1: "text-balance text-4xl font-semibold tracking-[0.01em] leading-[1.05] md:text-6xl",
  h2: "text-balance text-3xl font-semibold tracking-[0.01em] leading-[1.12] md:text-4xl",
  h3: "text-xl font-semibold tracking-[0.01em]",
  body: "text-pretty text-base leading-relaxed text-white/76",
  bodySm: "text-sm leading-relaxed text-white/70",
  kicker: "text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80",
} as const;

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "text";

export const formStyles = {
  panel: "rounded-3xl border border-white/12 bg-white/6 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur md:p-6",
  input:
    "w-full rounded-xl border border-white/14 bg-black/24 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/38 transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-500/15",
  label: "grid gap-2 text-sm text-white/72",
  error: "rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100",
  success: "rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100",
  submit:
    "inline-flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60",
} as const;

export function SiteContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4", className)}>{children}</div>;
}

export function SiteSection({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} data-reveal className={cn("py-16 md:py-20", className)}>
      {children}
    </section>
  );
}

export function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("ui-panel rounded-3xl p-6 md:p-8", className)}>{children}</div>;
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(buttonStyles(variant), className)}>
      {children}
    </Link>
  );
}

export function CtaButton({
  type = "button",
  onClick,
  children,
  variant = "primary",
  className,
  disabled,
}: {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(buttonStyles(variant), className)}>
      {children}
    </button>
  );
}

export function buttonStyles(variant: ButtonVariant) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60";

  if (variant === "primary") {
    return cn(
      base,
      "border border-cyan-300/35 bg-cyan-500 text-white shadow-[0_12px_38px_rgba(34,211,238,0.22)] hover:bg-cyan-400 hover:shadow-[0_16px_44px_rgba(34,211,238,0.30)]"
    );
  }

  if (variant === "secondary") {
    return cn(base, "border border-white/20 bg-white text-neutral-950 hover:bg-white/92");
  }

  if (variant === "outline") {
    return cn(base, "border border-white/18 bg-transparent text-white/90 hover:border-white/28 hover:bg-white/7");
  }

  if (variant === "text") {
    return cn(base, "rounded-xl px-2 py-1 text-white/78 hover:text-white");
  }

  return cn(base, "border border-white/20 bg-white/6 text-white/90 backdrop-blur hover:bg-white/10");
}

export function SectionIntro({
  kicker,
  title,
  subtitle,
  align = "left",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "mx-auto max-w-3xl text-center")}> 
      {kicker ? <p className={siteTypography.kicker}>{kicker}</p> : null}
      <h2 className={siteTypography.h2}>{title}</h2>
      {subtitle ? <p className={siteTypography.body}>{subtitle}</p> : null}
    </div>
  );
}
