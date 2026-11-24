import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
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
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-01-introduction">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><Link href="/k-scene">K‑SCENE</Link></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>УРОВЕНЬ 1 · УРОК 1</span><h1>Знакомство:<br />первое «안녕하세요».</h1></div><aside><b>ЦЕЛЬ УРОКА</b><p>Научись здороваться, называть своё имя и выбирать между 이에요 и 예요.</p></aside></header><section className="learn-layout"><LessonClient lessonId={lessonId} /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Две фразы: 안녕하세요 и 저는 …이에요/예요. Произнеси их вслух, пока не станет легко. Акцент сейчас не важен.</p></article><article className="learn-scene-note"><b>СЦЕНА ПОСЛЕ УРОКА</b><p>После мини‑теста открой сцену «Новый друг»: там эти фразы звучат в диалоге.</p><Link href="/k-scene/new-friend">ОТКРЫТЬ СЦЕНУ →</Link></article></aside></section></main>
    <KTutor context="lesson-01" />
  </>;
}
