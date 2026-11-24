import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { LessonThreeClient } from "./lesson-client";

export default async function LessonThreePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";

  return <><LessonStyleFix />
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-03-objects">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><Link href="/k-scene">K‑SCENE</Link></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>УРОВЕНЬ 1 · УРОК 3</span><h1>Что это?<br />이것은 뭐예요?</h1></div><aside><b>ЦЕЛЬ УРОКА</b><p>Научись называть предметы и выбирать 이것, 그것 или 저것 по расстоянию.</p></aside></header><section className="learn-layout"><LessonThreeClient lessonId="a1000000-0000-4000-8000-000000000103" /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Фраза о предмете рядом с тобой: <strong>이것은 ___이에요/예요.</strong></p></article><article className="learn-scene-note"><b>ЗАМЕТКА</b><p>Предмет рядом с тобой: 이것. Рядом с собеседником: 그것. Далеко от вас обоих: 저것.</p><Link href="/k-scene/what-is-this">ОТКРЫТЬ СЦЕНУ →</Link></article></aside></section></main>
    <KTutor context="lesson-03" />
  </>;
}
