"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Animate immediately (hero) instead of on scroll. */
  immediate?: boolean;
  delay?: number;
}

/**
 * Headline that reveals line-by-line with a masked rise — the signature
 * heading treatment across the site (see docs/04-design-system.md).
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  immediate = false,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.085,
        delay,
        ...(immediate
          ? {}
          : {
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }),
      });

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
