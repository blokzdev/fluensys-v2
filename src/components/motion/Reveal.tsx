"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  /** Animate immediate children individually with a stagger. */
  stagger?: boolean;
  /** Start offset in viewport units, e.g. "top 85%". */
  start?: string;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "ul" | "span";
}

/**
 * Scroll-triggered entrance animation. Content stays visible without JS or
 * under prefers-reduced-motion — GSAP sets the hidden state only when it is
 * actually going to animate.
 */
export function Reveal({
  children,
  stagger = false,
  start = "top 85%",
  delay = 0,
  y = 28,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const targets = stagger ? Array.from(ref.current.children) : [ref.current];
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          stagger: stagger ? 0.09 : 0,
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  const Tag = as;
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement & HTMLUListElement>} className={className} data-reveal>
      {children}
    </Tag>
  );
}
