/**
 * FluenSys brand mark — a centrifugal-pump volute in plan view, drawn as a
 * two-centre circular-arc approximation of an Archimedean spiral (classic
 * drafting technique). Green = casing, sweeping out to a tangential
 * discharge stub; azure = flow core spiralling from the impeller eye. The
 * two tones never touch — the gap at the cutwater keeps them separable at
 * favicon size.
 *
 * This file is the source of truth for the mark. The geometry is mirrored
 * by src/app/icon0.svg and consumed by the ImageResponse icon routes.
 */

export const VOLUTE_CASING_PATH = "M40 20.1A16 16 0 1 1 16 34A20 20 0 0 1 36 14L47 14";
export const VOLUTE_CORE_PATH = "M41 34A9 9 0 1 1 32 25";
export const VOLUTE_EYE = { cx: 32, cy: 34, r: 3 };
export const VOLUTE_CASING_STROKE = 5.5;
export const VOLUTE_CORE_STROKE = 5;

const MARK_SIZES = { sm: 24, md: 32, lg: 44 } as const;
const WORD_SIZES = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" } as const;

type LogoProps = {
  variant?: "lockup" | "mark" | "wordmark";
  size?: keyof typeof MARK_SIZES;
  monochrome?: boolean;
  className?: string;
};

export function VoluteMark({
  size = 32,
  monochrome = false,
  className,
}: {
  size?: number;
  monochrome?: boolean;
  className?: string;
}) {
  const casing = monochrome ? "currentColor" : "var(--color-green)";
  const core = monochrome ? "currentColor" : "var(--color-azure)";
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d={VOLUTE_CASING_PATH}
        stroke={casing}
        strokeWidth={VOLUTE_CASING_STROKE}
        strokeLinecap="round"
      />
      <path d={VOLUTE_CORE_PATH} stroke={core} strokeWidth={VOLUTE_CORE_STROKE} strokeLinecap="round" />
      <circle cx={VOLUTE_EYE.cx} cy={VOLUTE_EYE.cy} r={VOLUTE_EYE.r} fill={core} />
    </svg>
  );
}

function Wordmark({ size, monochrome }: { size: keyof typeof WORD_SIZES; monochrome: boolean }) {
  return (
    <span className={`text-display font-bold tracking-[0.18em] ${WORD_SIZES[size]}`}>
      <span className={monochrome ? "" : "text-green"}>FLUEN</span>
      <span className={monochrome ? "" : "text-azure"}>SYS</span>
    </span>
  );
}

export function Logo({
  variant = "lockup",
  size = "md",
  monochrome = false,
  className,
}: LogoProps) {
  if (variant === "mark") {
    return <VoluteMark size={MARK_SIZES[size]} monochrome={monochrome} className={className} />;
  }
  if (variant === "wordmark") {
    return (
      <span className={className}>
        <Wordmark size={size} monochrome={monochrome} />
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <VoluteMark size={MARK_SIZES[size]} monochrome={monochrome} />
      <Wordmark size={size} monochrome={monochrome} />
    </span>
  );
}
