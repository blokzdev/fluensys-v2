import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomeContent } from "@/lib/content/site";

const BADGE_STYLES: Record<string, string> = {
  INNOVATE: "text-azure-bright border-azure-bright/40 bg-azure-deep/20",
  OPTIMIZE: "text-green-bright border-green-bright/40 bg-green/10",
  MODERNIZE: "text-ink border-line-strong bg-surface-3/60",
};

export function Pillars({ content }: { content: HomeContent["pillars"] }) {
  const mailto = (title: string) =>
    `mailto:info@fluensys.co.uk?subject=${encodeURIComponent(`Service Request — ${title}`)}`;

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container-site">
        <SectionHeading
          eyebrow="What we do"
          title={content.title}
          subtitle={content.subtitle}
        />
        <Reveal stagger className="grid gap-6 lg:grid-cols-3">
          {content.items.map((pillar) => (
            <article
              key={pillar.id}
              className="card-surface group relative flex flex-col p-8 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-azure-bright/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 font-mono text-[0.65rem] tracking-[0.25em] ${
                  BADGE_STYLES[pillar.badge] ?? BADGE_STYLES.MODERNIZE
                }`}
              >
                {pillar.badge}
              </span>
              <h3 className="text-display mt-5 text-2xl font-semibold text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">{pillar.description}</p>
              <p className="text-eyebrow mt-7 mb-3 !text-ink-faint">Specialization</p>
              <ul className="mb-8 grid gap-2.5">
                {pillar.details.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-dim">
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-[3px] w-[14px] shrink-0 rounded-full bg-azure/70"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={mailto(pillar.title)}
                className="text-display mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium text-azure-bright transition-all duration-300 hover:gap-3"
              >
                {content.requestServiceLabel}
                <span aria-hidden>→</span>
              </a>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
