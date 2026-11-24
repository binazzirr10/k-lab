import type { Metadata } from "next";
import { Reference } from "@/app/components/motion-kit/reference";
import { GrammarTopics } from "./topics";
import { ParticleMachine, WordOrder } from "./practice";

export const metadata: Metadata = {
  title: "Грамматика корейского A1 | K‑Lab",
  description: "Частицы, связки и порядок слов из четырёх уроков K‑Lab. Правила на русском и интерактивная практика.",
};

export default function GrammarPage() {
  return <Reference active="grammar" title="Грамматика A1" description="Попробуй собрать предложение и подобрать частицу, затем закрепи правила примерами из тем курса.">
    <WordOrder /><ParticleMachine />
    <GrammarTopics />
  </Reference>;
}
