import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TeamContent } from "@/lib/content/site";

export function Team({ content }: { content: TeamContent }) {
  return (
    <section id="team" className="py-24 md:py-32">
      <div className="container-site">
        <SectionHeading
          eyebrow="The consultants"
          title={content.title}
          subtitle={content.description}
        />
        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {content.members.map((member) => (
            <article key={member.name} className="card-surface group overflow-hidden">
              <div className="relative aspect-[10/11] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-transparent to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-display text-xl font-semibold text-ink">{member.name}</h3>
                  <p className="mt-0.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-azure-bright">
                    {member.position}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                  {member.expertise}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-display mt-5 inline-flex items-center gap-2 text-sm text-azure-bright transition-all duration-300 hover:gap-3"
                >
                  Connect on LinkedIn <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
