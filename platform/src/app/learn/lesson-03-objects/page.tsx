import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
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
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a className="active" href="/learn/lesson-03-objects">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="https://k-lab-two.vercel.app/vocabulary.html">WORD DECK</a><a href="https://k-lab-two.vercel.app/kdrama.html">K‑DRAMA</a></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>LEVEL 01 · LESSON 03</span><h1>Что это?<br />이것은 뭐예요?</h1></div><aside><b>МИССИЯ УРОКА</b><p>Назови предметы вокруг себя и выбери правильную фразу: «это книга», «то сумка».</p></aside></header><section className="learn-layout"><LessonThreeClient lessonId="a1000000-0000-4000-8000-000000000103" /><aside className="learn-side"><article><h3>Твой фокус</h3><p>Не переводи дословно. Запомни модель: <strong>이것은 ___이에요.</strong></p></article><article className="learn-scene-note"><b>KZ NOTE</b><p>В корейском выбор «это / то» зависит от расстояния. Когда предмет рядом, используй 이것.</p><a href="https://k-lab-two.vercel.app/kdrama-scene.html?scene=objects">ОТКРЫТЬ СЦЕНУ →</a></article></aside></section></main>
    <KTutor lessonContext="Lesson 03: предметы. Помоги с фразами 이것은 책이에요, 이것은 가방이에요 и разницей 이것/그것/저것." />
  </>;
}
