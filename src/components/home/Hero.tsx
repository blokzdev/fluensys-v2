"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { HomeContent } from "@/lib/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export function Hero({ content }: { content: HomeContent["hero"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [renderScene, setRenderScene] = useState(false);

  useEffect(() => {
    // Skip WebGL for reduced motion or save-data users; the CSS backdrop
    // already carries the composition.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      "connection" in navigator &&
      (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (!reduced && !saveData) setRenderScene(true);
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        "[data-hero-fade]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.5 },
      );

      // Count the hero stats up from zero; the real value is server-
      // rendered, so SEO and no-JS/reduced-motion users see it untouched.
      gsap.utils.toArray<HTMLElement>("[data-hero-stat]").forEach((el) => {
        const value = el.dataset.heroStat ?? "";
        const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
        if (!match) return;
        const [, prefix, num, suffix] = match;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: parseFloat(num),
          duration: 1.6,
          delay: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.v)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = value;
          },
        });
      });

      // Slow parallax drift of the scene as you scroll away.
      gsap.to("[data-hero-canvas]", {
        yPercent: 18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layered backdrop: deep gradient + blueprint grid + WebGL flow field */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_-5%,#15578a55,transparent_70%),radial-gradient(ellipse_50%_40%_at_85%_100%,#72bf4418,transparent_70%)]"
      />
      <div aria-hidden className="bg-blueprint absolute inset-0 opacity-60" />
      <div data-hero-canvas className="absolute inset-0">
        {renderScene ? <HeroScene /> : null}
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-abyss"
      />

      <div className="container-site relative z-10 pt-28 pb-20">
        <p data-hero-fade className="text-eyebrow mb-6">
          {content.eyebrow}
        </p>
        <SplitHeading
          as="h1"
          immediate
          delay={0.25}
          text={content.title}
          className="text-display max-w-4xl text-5xl font-bold leading-[1.04] text-ink sm:text-6xl lg:text-7xl text-balance"
        />
        <p
          data-hero-fade
          className="mt-7 max-w-xl text-lg leading-relaxed text-ink-dim sm:text-xl"
        >
          {content.subtitle}
        </p>
        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href={content.primaryCta.href}>{content.primaryCta.label}</ButtonLink>
          <ButtonLink href={content.secondaryCta.href} variant="outline">
            {content.secondaryCta.label}
          </ButtonLink>
        </div>

        <dl data-hero-fade className="mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {content.stats.map((stat) => (
            <div key={stat.label} className="border-l border-line-strong pl-5">
              <dt className="sr-only">{stat.label}</dt>
              <dd
                data-hero-stat={stat.value}
                className="text-display text-3xl font-semibold text-ink"
              >
                {stat.value}
              </dd>
              <dd className="mt-1 text-xs leading-relaxed text-ink-faint">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#services"
        data-hero-fade
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-faint transition-colors hover:text-azure-bright md:flex"
        aria-label="Scroll to services"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-azure-bright to-transparent" />
      </a>
    </section>
  );
}
