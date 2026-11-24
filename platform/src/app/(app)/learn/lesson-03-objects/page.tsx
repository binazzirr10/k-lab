import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonThreeClient } from "./lesson-client";

export default async function LessonThreePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";

  return <>
    <AppNav active="learn"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>Уровень 1 · урок 3</span><h1>Что это? 이것은 뭐예요?</h1></div><aside><b>Цель урока</b><p>Научись называть предметы и выбирать 이것, 그것 или 저것 по расстоянию.</p></aside></header><section className="learn-layout"><LessonThreeClient lessonId="a1000000-0000-4000-8000-000000000103" /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Фраза о предмете рядом с тобой: <strong>이것은 ___이에요/예요.</strong></p></article><article className="learn-scene-note"><b>Заметка</b><p>Предмет рядом с тобой: 이것. Рядом с собеседником: 그것. Далеко от вас обоих: 저것.</p><Link href="/k-scene/what-is-this">Открыть сцену →</Link></article></aside></section></main>
    <KTutor context="lesson-03" />
  </>;
}
