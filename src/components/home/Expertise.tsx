"use client";

import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomeContent } from "@/lib/content/site";

export function Expertise({ content }: { content: HomeContent["expertise"] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = activeGroup
    ? content.groups.filter((g) => g.key === activeGroup)
    : content.groups;

  return (
    <section id="expertise" className="relative border-y border-line bg-surface py-24 md:py-32">
      <div aria-hidden className="bg-blueprint absolute inset-0 opacity-30" />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="Domain knowledge"
          title={content.title}
          subtitle={content.subtitle}
        />

        <Reveal className="mb-10 flex flex-wrap items-center gap-3">
          {content.groups.map((group) => {
            const active = activeGroup === group.key;
            return (
              <button
                key={group.key}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveGroup(active ? null : group.key)}
                className={`rounded-full border px-5 py-2.5 font-display text-sm transition-all duration-300 ${
                  active
                    ? "border-azure-bright bg-azure-deep/30 text-azure-bright"
                    : "border-line text-ink-dim hover:border-line-strong hover:text-ink"
                }`}
              >
                {group.label}
              </button>
            );
          })}
          <span className="ml-1 hidden font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint sm:inline">
            {content.filterInstructions}
          </span>
        </Reveal>

        <div className="grid gap-10">
          {groups.map((group) => (
            <div key={group.key}>
              <h3 className="text-eyebrow mb-5 !text-ink-faint">{group.label}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="card-surface p-6 transition-colors duration-300 hover:border-line-strong"
                  >
                    <h4 className="text-display text-lg font-semibold text-ink">{item.name}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
                      {item.description}
                    </p>
                    <ul className="mt-4 grid gap-3 border-t border-line pt-4">
                      {item.subtypes.map((sub) => (
                        <li key={sub.name}>
                          <p className="text-sm font-medium text-ink-dim">{sub.name}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
                            {sub.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
