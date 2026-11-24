import type { Metadata } from "next";
import { Reference } from "@/app/components/motion-kit/reference";
import { Phrasebook } from "./phrasebook";

export const metadata: Metadata = {
  title: "Корейский разговорник A1 с озвучкой | K‑Lab",
  description: "80 корейских фраз для знакомства, кафе, дороги, магазина, учёбы и других ситуаций с переводом и озвучкой.",
};

export default function PhrasesPage() {
  return <Reference active="phrases" title="Разговорник" description="Найди фразу по-корейски, по-русски или латиницей. Фразы вежливые. В каждой ситуации есть короткий диалог с озвучкой по репликам.">
    <Phrasebook />
  </Reference>;
}
