import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { LessonTwoClient } from "./lesson-client";

export default async function LessonTwoPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <>
    <LessonStyleFix />
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-02-country">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><Link href="/k-scene">K‑SCENE</Link></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>УРОВЕНЬ 1 · УРОК 2</span><h1>Откуда<br />ты?</h1></div><aside><b>ЦЕЛЬ УРОКА</b><p>Научись говорить, из какой ты страны, и отличать 이에요 от 아니에요.</p></aside></header><section className="learn-layout"><LessonTwoClient lessonId="a1000000-0000-4000-8000-000000000102" /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Название своей страны по‑корейски и фраза 저는 … 사람이에요.</p></article><article className="learn-scene-note"><b>ПОСЛЕ УРОКА</b><p>В этой сцене Минджи спрашивает Алину, откуда она.</p><Link href="/k-scene/where-are-you-from">ОТКРЫТЬ СЦЕНУ →</Link></article></aside></section></main>
    <KTutor context="lesson-02" />
  </>;
}
