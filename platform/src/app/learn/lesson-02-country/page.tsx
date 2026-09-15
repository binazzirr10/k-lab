import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
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
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-02-country">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><a href="https://k-lab-two.vercel.app/kdrama.html">K‑DRAMA</a></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>LEVEL 01 · LESSON 02</span><h1>Откуда<br />ты?</h1></div><aside><b>МИССИЯ УРОКА</b><p>Скажи, из какой ты страны, назови язык и отличи 이에요 от 아니에요.</p></aside></header><section className="learn-layout"><LessonTwoClient lessonId="a1000000-0000-4000-8000-000000000102" /><aside className="learn-side"><article><h3>Твой фокус</h3><p>Сегодня запомни свою страну и фразу 저는 … 사람이에요.</p></article><article className="learn-scene-note"><b>ПОСЛЕ УРОКА</b><p>В K‑Scene Минджи спросит Алину, откуда она приехала.</p><a href="https://k-lab-two.vercel.app/kdrama-scene.html?scene=country">ОТКРЫТЬ СЦЕНУ →</a></article></aside></section></main>
    <KTutor lessonContext="Lesson 02: страны. Фразы 어느 나라 사람이에요?, 저는 카자흐스탄 사람이에요, 아니에요." />
  </>;
}
