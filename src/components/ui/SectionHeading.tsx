import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left" }: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-4 ${alignment} mb-12 md:mb-16`}>
      <Reveal>
        <p className="text-eyebrow">
          <span aria-hidden className="mr-3 inline-block h-px w-8 bg-azure-bright align-middle" />
          {eyebrow}
        </p>
      </Reveal>
      <SplitHeading
        text={title}
        className="text-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl text-balance"
      />
      {subtitle ? (
        <Reveal delay={0.15}>
          <p className="max-w-2xl text-base text-ink-dim sm:text-lg">{subtitle}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
