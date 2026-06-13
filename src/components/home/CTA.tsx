import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { HomeContent } from "@/lib/content/site";

export function CTA({ content, email }: { content: HomeContent["cta"]; email: string }) {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,#15578a4d,transparent_72%)]"
      />
      <div className="container-site relative flex flex-col items-center text-center">
        <SplitHeading
          text={content.title}
          className="text-display text-4xl font-bold text-ink sm:text-5xl lg:text-6xl text-balance"
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-ink-dim">{content.subtitle}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <a
            href={`mailto:${email}?subject=${encodeURIComponent("Consultancy enquiry — fluensys.co.uk")}`}
            className="text-display group mt-10 inline-flex items-center gap-3 rounded-full bg-azure px-9 py-4 text-base font-medium text-white shadow-[0_0_40px_-8px_var(--color-azure)] transition-all duration-300 hover:bg-azure-bright hover:shadow-[0_0_56px_-6px_var(--color-azure-bright)]"
          >
            {content.buttonText}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
