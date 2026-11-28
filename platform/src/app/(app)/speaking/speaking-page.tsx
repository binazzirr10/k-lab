"use client";

import { LazyMotion } from "motion/react";
import type { PracticePhrases } from "@/lib/landing/phrases";
import { SpeakingLab } from "@/app/components/landing/sections/speaking-lab";

const loadMotion = () => import("@/app/components/motion-kit/features").then((module) => module.default);

export function SpeakingPage({ phrases }: { phrases: PracticePhrases }) {
  return <LazyMotion strict features={loadMotion}><main><SpeakingLab lang="ru" phrases={phrases} standalone /></main></LazyMotion>;
}
