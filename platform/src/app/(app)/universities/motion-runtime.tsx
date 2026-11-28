"use client";

import { m, useIsPresent, type HTMLMotionProps } from "motion/react";

export { AnimatePresence, m } from "motion/react";
export { MotionScope, spring } from "@/app/components/motion-kit/motion";

export function PresenceRow(props: HTMLMotionProps<"li">) {
  const present = useIsPresent();
  return <m.li {...props} inert={!present} />;
}

export function PresenceHeader(props: HTMLMotionProps<"th">) {
  const present = useIsPresent();
  return <m.th {...props} inert={!present} />;
}

export function PresenceCell(props: HTMLMotionProps<"td">) {
  const present = useIsPresent();
  return <m.td {...props} inert={!present} />;
}
