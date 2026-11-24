"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Animates only when the address changes, not on updates inside a page. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <ViewTransition key={usePathname()} enter="klab-page" exit="klab-page" default="none">{children}</ViewTransition>;
}
