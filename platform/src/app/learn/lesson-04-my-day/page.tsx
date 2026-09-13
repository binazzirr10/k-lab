import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { LessonFourClient } from "./lesson-client";

export default async function LessonFourPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <><LessonStyleFix />
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-04-my-day">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><a href="https://k-lab-two.vercel.app/kdrama.html">K‑DRAMA</a></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>LEVEL 01 · LESSON 04</span><h1>Мой день.<br />오늘 뭐 해요?</h1></div><aside><b>МИССИЯ УРОКА</b><p>Расскажи о трёх действиях своего дня и познакомься с вежливым настоящим временем.</p></aside></header><section className="learn-layout"><LessonFourClient lessonId="a1000000-0000-4000-8000-000000000104" /><aside className="learn-side"><article><h3>Твой фокус</h3><p>Запоминай глагол вместе с готовой фразой — так легче говорить в реальности.</p></article><article className="learn-scene-note"><b>KZ NOTE</b><p>«Я» — 저는 — в корейском часто можно пропустить, если уже понятно, кто говорит.</p><a href="https://k-lab-two.vercel.app/kdrama-scene.html?scene=daily">ОТКРЫТЬ СЦЕНУ →</a></article></aside></section></main>
    <KTutor lessonContext="Lesson 04: распорядок дня. Фразы 한국어를 공부해요, 커피를 마셔요, 김밥을 먹어요, 친구를 만나요. Объясняй -아요/어요 просто." />
  </>;
}
