"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PillarGrid({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.classList.add("pillar-arrived");
        observer.unobserve(target);
      }
    }, { threshold: 0.15 });

    for (const pillar of grid.children) observer.observe(pillar);
    return () => observer.disconnect();
  }, []);

  return <div className="pillar-grid" ref={gridRef}>{children}</div>;
}
