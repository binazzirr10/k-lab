"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./motion.module.css";

/** Writing soaks in like wet ink on hanji: blots spread, join, and dry into sharp type. */
export function Ink({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const id = `ink-${useId().replace(/[^a-z0-9]/gi, "")}`;

  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const text = node.querySelector<HTMLElement>("[data-ink]");
    const displace = node.querySelector("feDisplacementMap");
    const blur = node.querySelector("feGaussianBlur");
    const edge = node.querySelector("feFuncA");
    if (!text || !displace || !blur || !edge) return;
    let frame = 0;
    const dry = () => { text.style.filter = ""; text.style.opacity = ""; text.style.maskImage = ""; };
    const soak = (progress: number) => {
      const wet = 1 - progress;
      displace.setAttribute("scale", String(wet * wet * 130));
      blur.setAttribute("stdDeviation", String(wet * 11 + .01));
      // A steep alpha curve turns the blur back into hard, spreading blots.
      edge.setAttribute("slope", String(1 + wet * 13));
      edge.setAttribute("intercept", String(-wet * 4.6));
      text.style.opacity = String(Math.min(1, .25 + progress * 1.4));
      const reach = progress * 150 - 30;
      text.style.maskImage = `linear-gradient(100deg, #000 ${reach}%, transparent ${reach + 34}%)`;
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      text.style.filter = `url(#${id})`;
      const begin = performance.now();
      const step = (now: number) => {
        const time = Math.min(1, Math.max(0, now - begin) / 1700);
        soak(1 - (1 - time) ** 2.6);
        if (time < 1) frame = requestAnimationFrame(step);
        else dry();
      };
      frame = requestAnimationFrame(step);
    }, { threshold: .3 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); dry(); };
  }, [id]);

  return <span ref={ref} className={styles.lines}>
    <svg className={styles.filters} aria-hidden="true" focusable="false"><defs>
      <filter id={id} x="-12%" y="-35%" width="124%" height="170%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".018 .03" numOctaves="3" seed="7" result="grain" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="soft" />
        <feComponentTransfer in="soft" result="blot"><feFuncA type="linear" slope="1" intercept="0" /></feComponentTransfer>
        <feDisplacementMap in="blot" in2="grain" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs></svg>
    <span data-ink="">{children}</span>
  </span>;
}
