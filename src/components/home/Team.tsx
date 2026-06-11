import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TeamContent, TeamMember } from "@/lib/content/site";

/**
 * "Engineering drawing sheets" — each consultant is presented like a
 * numbered sheet from a drawing set: corner registration ticks, a mono
 * sheet reference, an experience counter, and a title block. Portraits get
 * a uniform azure duotone (grayscale + brand tint) so disparate source
 * photography reads as one deliberate, branded set; full colour develops
 * on hover/focus. See docs/04-design-system.md.
 */

function CornerTicks() {
  const tick = "absolute h-3.5 w-3.5 border-azure-bright/60 transition-colors duration-500 group-hover:border-azure-bright";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-2 z-10">
      <span className={`${tick} left-0 top-0 border-l border-t`} />
      <span className={`${tick} right-0 top-0 border-r border-t`} />
      <span className={`${tick} bottom-0 left-0 border-b border-l`} />
      <span className={`${tick} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

function MemberSheet({ member, index }: { member: TeamMember; index: number }) {
  return (
    <article
      className={`card-surface group relative flex flex-col overflow-hidden transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-line-strong ${
        index === 1 ? "lg:translate-y-10 lg:hover:translate-y-[2.125rem]" : ""
      }`}
    >
      {/* Sheet header strip */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-ink-faint">
          FS·TEAM·{String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex items-baseline gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-azure-bright">
          <span className="text-display text-base font-semibold tracking-normal">
            {member.years}
          </span>
          yrs experience
        </span>
      </div>

      {/* Portrait with uniform duotone treatment */}
      <div className="relative m-2 aspect-[4/4.6] overflow-hidden rounded-lg bg-surface-2">
        <CornerTicks />
        <Image
          src={member.image}
          alt={`Portrait of ${member.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-focus-within:scale-[1.03] group-focus-within:grayscale-0 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        {/* Brand tint: colours the grayscale portrait azure; lifts on hover */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-tr from-azure-deep/80 via-azure/35 to-green/15 mix-blend-color transition-opacity duration-700 group-focus-within:opacity-0 group-hover:opacity-0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-abyss/10 to-transparent"
        />
        {/* Name plate over the portrait */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <h3 className="text-display text-xl font-semibold leading-tight text-ink">
            {member.name}
          </h3>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-azure-bright">
            {member.position}
          </p>
        </div>
      </div>

      {/* Title block */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <p className="font-mono text-[0.68rem] leading-relaxed text-ink-faint">
          {member.credentials}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-dim">
          {member.expertise}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {member.specialisms.map((item) => (
            <li
              key={item}
              className="rounded-full border border-line px-3 py-1 text-[0.7rem] leading-relaxed text-ink-dim transition-colors duration-300 group-hover:border-line-strong"
            >
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm leading-relaxed text-ink-dim">{member.bio}</p>

        <div className="mt-6 border-t border-line pt-4">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-display inline-flex items-center gap-2 text-sm text-azure-bright transition-all duration-300 hover:gap-3"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
            Connect on LinkedIn
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Team({ content }: { content: TeamContent }) {
  return (
    <section id="team" className="relative overflow-hidden py-24 md:py-32 lg:pb-44">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_80%_10%,#15578a33,transparent_70%)]"
      />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="The consultants"
          title={content.title}
          subtitle={content.description}
        />
        <Reveal stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {content.members.map((member, index) => (
            <MemberSheet key={member.id} member={member} index={index} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
