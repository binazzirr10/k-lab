import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
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
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/checkpoint/section-01">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><a href="https://k-lab-two.vercel.app/kdrama.html">K‑DRAMA</a></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>LEVEL 01 · SECTION 01</span><h1>Checkpoint 01.<br />Первый разговор.</h1></div><aside><b>50 БАЛЛОВ · ПРОХОДНОЙ 35</b><p>Проверь слова, грамматику, порядок фраз, аудирование и голос. Это итог четырёх первых уроков.</p></aside></header><section className="learn-layout"><CheckpointClient lessonId="a1000000-0000-4000-8000-000000000105" /><aside className="learn-side"><article><h3>Как пройти</h3><p>Можно возвращаться к урокам. Засчитывается лучший результат, а +50 XP выдаются только за первое прохождение.</p></article><article className="learn-scene-note"><b>ПОСЛЕ CHECKPOINT</b><p>Твой маршрут Level 01 сохранится в дашборде как завершённый раздел.</p><a href="/studio">ВЕРНУТЬСЯ В РИТМ →</a></article></aside></section></main>
    <KTutor lessonContext="Checkpoint 01. Не давай готовые ответы. Объясни правило или дай маленькую подсказку по фразе, если ученик попросит." />
  </>;
}
