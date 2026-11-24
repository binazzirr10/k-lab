import { flushSync } from "react-dom";

type Kind = "language" | "handoff";

/** Runs a change inside a browser view transition, or at once where that is not possible. */
export function withTransition(kind: Kind, change: () => void, finished?: () => void) {
  const apply = () => flushSync(change);
  if (!("startViewTransition" in document) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    finished?.();
    return;
  }
  document.documentElement.dataset.transition = kind;
  const transition = document.startViewTransition(apply);
  void transition.finished.catch(() => {}).then(() => {
    delete document.documentElement.dataset.transition;
    finished?.();
  });
}
