import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { LessonClient } from "./lesson-client";

const lessonId = "a1000000-0000-4000-8000-000000000101";

export default async function LessonOnePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <>
    <LessonStyleFix />
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-01-introduction">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><a href="https://k-lab-two.vercel.app/kdrama.html">K‑DRAMA</a></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>LEVEL 01 · LESSON 01</span><h1>Знакомство:<br />первое «안녕하세요».</h1></div><aside><b>МИССИЯ УРОКА</b><p>Поздоровайся, назови своё имя и пойми, когда использовать 이에요 / 예요.</p></aside></header><section className="learn-layout"><LessonClient lessonId={lessonId} /><aside className="learn-side"><article><h3>Твой фокус</h3><p>Не гонись за идеальным акцентом. Сегодня цель — уверенно произнести две фразы и понять их структуру.</p></article><article className="learn-scene-note"><b>K‑SCENE ПОСЛЕ УРОКА</b><p>После mini‑test открой сцену «Новый друг» и услышь эти фразы в живом диалоге.</p><a href="https://k-lab-two.vercel.app/kdrama-scene.html?scene=intro">ОТКРЫТЬ СЦЕНУ →</a></article></aside></section></main>
    <KTutor lessonContext="Lesson 01: знакомство. Фразы 안녕하세요, 저는 ...예요. Грамматика 이에요/예요 и 저는." />
  </>;
}
