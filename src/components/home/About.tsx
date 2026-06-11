import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomeContent } from "@/lib/content/site";

export function About({ content }: { content: HomeContent["about"] }) {
  return (
    <section id="about" className="relative border-y border-line bg-surface py-24 md:py-32">
      <div className="container-site grid items-start gap-14 lg:grid-cols-[3fr_2fr]">
        <div>
          <SectionHeading eyebrow="Who we are" title={content.title} />
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-dim">
              {content.description}
            </p>
          </Reveal>

          <Reveal stagger className="mt-10 flex flex-wrap gap-3">
            {content.values.map((value) => (
              <span
                key={value.text}
                className="rounded-full border border-green-bright/30 bg-green/10 px-5 py-2 font-display text-sm text-green-bright"
              >
                {value.text}
              </span>
            ))}
          </Reveal>

          <Reveal stagger className="mt-8 grid max-w-xl gap-3">
            {content.keyPoints.map((point) => (
              <p key={point} className="flex items-center gap-3 text-sm text-ink-dim">
                <span aria-hidden className="h-px w-6 bg-azure-bright" />
                {point}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {content.certificationBadges.map((badge) => (
            <a
              key={badge.alt}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface group flex items-center gap-5 p-5 transition-colors hover:border-line-strong"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                <Image
                  src={badge.src}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-sm leading-snug text-ink-dim transition-colors group-hover:text-ink">
                {badge.alt}
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
