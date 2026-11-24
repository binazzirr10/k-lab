import { useEffect } from "react";

/** Large pictures open on their own clock once they come into view, so they never rest half-open. */
export function useEntrances() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = [...document.querySelectorAll<HTMLElement>("[data-open-on-view]")]
      .filter((target) => target.getBoundingClientRect().top > innerHeight);
    const watch = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
      delete (entry.target as HTMLElement).dataset.closed;
      watch.unobserve(entry.target);
    }), { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((target) => { target.dataset.closed = ""; watch.observe(target); });
    return () => { watch.disconnect(); targets.forEach((target) => delete target.dataset.closed); };
  }, []);
}
