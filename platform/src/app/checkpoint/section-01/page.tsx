import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { CheckpointClient } from "./checkpoint-client";

export default async function CheckpointPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <><LessonStyleFix />
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/checkpoint/section-01">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><Link href="/k-scene">K‑SCENE</Link></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>УРОВЕНЬ 1 · РАЗДЕЛ 1</span><h1>Checkpoint 01.<br />Первый разговор.</h1></div><aside><b>50 БАЛЛОВ · ПРОХОДНОЙ 35</b><p>Вопросы по словам, грамматике, фразам и аудированию и две фразы вслух. Это итог четырёх первых уроков.</p></aside></header><section className="learn-layout"><CheckpointClient lessonId="a1000000-0000-4000-8000-000000000105" /><aside className="learn-side"><article><h3>Как пройти</h3><p>Фразы для Speaking Lab открывай в новой вкладке: после ухода со страницы ответы могут пропасть. Сохраняется лучший результат от 35 баллов, +50 XP даются один раз.</p></article><article className="learn-scene-note"><b>ПОСЛЕ CHECKPOINT</b><p>В кабинете «Мой ритм» у Checkpoint 01 появится отметка 100%.</p><a href="/studio">ОТКРЫТЬ «МОЙ РИТМ» →</a></article></aside></section></main>
    <KTutor context="checkpoint-01" />
  </>;
}
