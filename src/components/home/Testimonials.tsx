import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TestimonialsContent } from "@/lib/content/site";

export function Testimonials({ content }: { content: TestimonialsContent }) {
  return (
    <section className="py-24 md:py-32">
      <div className="container-site">
        <SectionHeading eyebrow="Client voices" title="What they say" />
        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {content.items.map((item) => (
            <figure key={item.id} className="card-surface relative flex flex-col p-8">
              <span
                aria-hidden
                className="text-display absolute -top-1 right-6 select-none text-7xl font-bold text-azure/15"
              >
                &ldquo;
              </span>
              <blockquote className="text-base leading-relaxed text-ink">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-5">
                <p className="text-display text-sm font-semibold text-ink">{item.author}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {item.company} · {item.year}
                </p>
                <p className="mt-2 font-mono text-[0.65rem] leading-relaxed text-ink-faint">
                  {item.project}
                </p>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
