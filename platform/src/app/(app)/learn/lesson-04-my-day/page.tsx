import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonFourClient } from "./lesson-client";

export default async function LessonFourPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <>
    <AppNav active="learn"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>Уровень 1 · урок 4</span><h1>Мой день. 오늘 뭐 해요?</h1></div><aside><b>Цель урока</b><p>Научись говорить, что ты делаешь днём, в вежливом настоящем времени на -아요/어요.</p></aside></header><section className="learn-layout"><LessonFourClient lessonId="a1000000-0000-4000-8000-000000000104" /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Глагол вместе с целой фразой: 커피를 마셔요, 김밥을 먹어요, 친구를 만나요.</p></article><article className="learn-scene-note"><b>Заметка</b><p>Слово 저는 («я») в корейском часто пропускают, если и так понятно, о ком речь.</p><Link href="/k-scene/joons-day">Открыть сцену →</Link></article></aside></section></main>
    <KTutor context="lesson-04" />
  </>;
}
