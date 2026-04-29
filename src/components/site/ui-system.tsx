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
  variant?: "primary" | "secondary" | "ghost";
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
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(buttonStyles(variant), className)}>
      {children}
    </button>
  );
}

function buttonStyles(variant: "primary" | "secondary" | "ghost") {
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
