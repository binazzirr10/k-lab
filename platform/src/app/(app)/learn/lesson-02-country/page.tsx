import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonTwoClient } from "./lesson-client";

export default async function LessonTwoPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <>

    <AppNav active="learn"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>Уровень 1 · урок 2</span><h1>Откуда ты?</h1></div><aside><b>Цель урока</b><p>Научись говорить, из какой ты страны, и отличать 이에요 от 아니에요.</p></aside></header><section className="learn-layout"><LessonTwoClient lessonId="a1000000-0000-4000-8000-000000000102" /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Название своей страны по‑корейски и фраза 저는 … 사람이에요.</p></article><article className="learn-scene-note"><b>После урока</b><p>В этой сцене Минджи спрашивает Алину, откуда она.</p><Link href="/k-scene/where-are-you-from">Открыть сцену →</Link></article></aside></section></main>
    <KTutor context="lesson-02" />
  </>;
}
