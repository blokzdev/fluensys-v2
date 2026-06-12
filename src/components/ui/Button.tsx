import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "steel";
type Size = "sm" | "md";

const styles: Record<Variant, string> = {
  primary:
    "bg-azure text-white hover:bg-azure-bright shadow-[0_0_24px_-6px_var(--color-azure)] hover:shadow-[0_0_32px_-4px_var(--color-azure-bright)]",
  ghost: "text-ink-dim hover:text-ink hover:bg-surface-2",
  outline:
    "border border-line-strong text-ink hover:border-azure-bright hover:text-azure-bright",
  // Neutral hardware chrome — secondary/cancel actions (see docs/04).
  steel:
    "border border-steel-line bg-steel-deep/60 text-ink-dim hover:border-steel-bright hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm min-h-[44px]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "font-display tracking-wide transition-all duration-300 ease-out cursor-pointer " +
  "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: { variant?: Variant; size?: Size; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button className={`${base} ${sizes[size]} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: { variant?: Variant; size?: Size; children: ReactNode; href: string } & Omit<
  ComponentProps<typeof Link>,
  "href"
>) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
