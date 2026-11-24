import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { CheckpointClient } from "./checkpoint-client";

export default async function CheckpointPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <>
    <AppNav active="learn"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>Уровень 1 · раздел 1</span><h1>Checkpoint 01. Первый разговор.</h1></div><aside><b>50 баллов · проходной 35</b><p>Вопросы по словам, грамматике, фразам и аудированию и две фразы вслух. Это итог четырёх первых уроков.</p></aside></header><section className="learn-layout"><CheckpointClient lessonId="a1000000-0000-4000-8000-000000000105" /><aside className="learn-side"><article><h3>Как пройти</h3><p>Фразы для Speaking Lab открывай в новой вкладке: после ухода со страницы ответы могут пропасть. Сохраняется лучший результат от 35 баллов, +50 XP даются один раз.</p></article><article className="learn-scene-note"><b>После Checkpoint</b><p>В кабинете «Мой ритм» у Checkpoint 01 появится отметка 100%.</p><a href="/studio">Открыть «Мой ритм» →</a></article></aside></section></main>
    <KTutor context="checkpoint-01" />
  </>;
}
