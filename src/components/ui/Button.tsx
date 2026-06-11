import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-azure text-white hover:bg-azure-bright shadow-[0_0_24px_-6px_var(--color-azure)] hover:shadow-[0_0_32px_-4px_var(--color-azure-bright)]",
  ghost: "text-ink-dim hover:text-ink hover:bg-surface-2",
  outline:
    "border border-line-strong text-ink hover:border-azure-bright hover:text-azure-bright",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium " +
  "font-display tracking-wide transition-all duration-300 ease-out cursor-pointer " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  href,
  ...props
}: { variant?: Variant; children: ReactNode; href: string } & Omit<
  ComponentProps<typeof Link>,
  "href"
>) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
