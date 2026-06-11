"use client";

import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomeContent } from "@/lib/content/site";

export function ConsultancyTabs({ content }: { content: HomeContent["consultancy"] }) {
  const [active, setActive] = useState(0);
  const category = content.categories[active];

  return (
    <section className="py-24 md:py-32">
      <div className="container-site">
        <SectionHeading
          eyebrow="Consultancy services"
          title="Explore our range of consultancy services"
        />

        <Reveal className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div
            role="tablist"
            aria-label="Consultancy categories"
            className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {content.categories.map((cat, i) => (
              <button
                key={cat.title}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`whitespace-nowrap rounded-xl border px-5 py-3.5 text-left font-display text-sm tracking-wide transition-all duration-300 ${
                  i === active
                    ? "border-azure-bright/50 bg-azure-deep/25 text-ink"
                    : "border-line text-ink-dim hover:border-line-strong hover:text-ink"
                }`}
              >
                <span className="mr-3 font-mono text-[0.65rem] text-azure-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {cat.title}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="card-surface min-h-[280px] p-8">
            <h3 className="text-display text-xl font-semibold text-ink">{category.title}</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-l border-line-strong pl-4 text-sm leading-relaxed text-ink-dim"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
