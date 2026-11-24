import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
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
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-04-my-day">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><Link href="/k-scene">K‑SCENE</Link></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>УРОВЕНЬ 1 · УРОК 4</span><h1>Мой день.<br />오늘 뭐 해요?</h1></div><aside><b>ЦЕЛЬ УРОКА</b><p>Научись говорить, что ты делаешь днём, в вежливом настоящем времени на -아요/어요.</p></aside></header><section className="learn-layout"><LessonFourClient lessonId="a1000000-0000-4000-8000-000000000104" /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Глагол вместе с целой фразой: 커피를 마셔요, 김밥을 먹어요, 친구를 만나요.</p></article><article className="learn-scene-note"><b>ЗАМЕТКА</b><p>Слово 저는 («я») в корейском часто пропускают, если и так понятно, о ком речь.</p><Link href="/k-scene/joons-day">ОТКРЫТЬ СЦЕНУ →</Link></article></aside></section></main>
    <KTutor context="lesson-04" />
  </>;
}
