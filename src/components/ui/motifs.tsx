import {
  VOLUTE_CASING_PATH,
  VOLUTE_CORE_PATH,
  VOLUTE_EYE,
} from "@/components/ui/Logo";

/**
 * Flow motif library — small SVG ornaments derived from the brand mark.
 * All server-safe; the spinner animates via CSS keyframes so it runs
 * before hydration and is neutralised by the global reduced-motion
 * override in globals.css.
 */

const BLADES = Array.from({ length: 6 }, (_, k) => {
  const sweep = (deg: number) => (deg * Math.PI) / 180;
  const t = sweep(k * 60);
  const mid = sweep(k * 60 + 24);
  const tip = sweep(k * 60 + 40);
  const pt = (angle: number, r: number) =>
    `${(12 + r * Math.cos(angle)).toFixed(2)} ${(12 + r * Math.sin(angle)).toFixed(2)}`;
  return `M${pt(t, 4.5)}Q${pt(mid, 7.5)} ${pt(tip, 10.5)}`;
});

export function ImpellerIcon({
  size = 24,
  monochrome = false,
  className,
}: {
  size?: number;
  monochrome?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden className={className}>
      <circle cx={12} cy={12} r={2.6} stroke="currentColor" strokeWidth={1.6} />
      {BLADES.map((d, k) => (
        <path
          key={d}
          d={d}
          stroke={monochrome ? "currentColor" : k % 3 === 0 ? "var(--color-green)" : "var(--color-azure-bright)"}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function ImpellerSpinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <span role="status" aria-label="Loading" className={`inline-flex ${className ?? ""}`}>
      <span className="animate-impeller inline-flex text-ink-faint">
        <ImpellerIcon size={size} />
      </span>
    </span>
  );
}

export function FlowDroplet({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className}>
      <path
        d="M12 3c3.5 4.6 6 7.9 6 11.1a6 6 0 1 1-12 0C6 10.9 8.5 7.6 12 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function VoluteContour({ size = 320, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      className={className}
    >
      <path d={VOLUTE_CASING_PATH} stroke="currentColor" strokeWidth={0.75} strokeLinecap="round" />
      <path d={VOLUTE_CORE_PATH} stroke="currentColor" strokeWidth={0.75} strokeLinecap="round" />
      <circle
        cx={VOLUTE_EYE.cx}
        cy={VOLUTE_EYE.cy}
        r={VOLUTE_EYE.r}
        stroke="currentColor"
        strokeWidth={0.75}
      />
      <circle cx={32} cy={32} r={26} stroke="currentColor" strokeWidth={0.4} strokeDasharray="1.5 3" />
    </svg>
  );
}
