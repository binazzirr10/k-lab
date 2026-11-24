import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonClient } from "./lesson-client";

const lessonId = "a1000000-0000-4000-8000-000000000101";

export default async function LessonOnePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  return <>

    <AppNav active="learn"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
    <main className="learn-wrap"><header className="learn-hero"><div><span>Уровень 1 · урок 1</span><h1>Знакомство: первое «안녕하세요».</h1></div><aside><b>Цель урока</b><p>Научись здороваться, называть своё имя и выбирать между 이에요 и 예요.</p></aside></header><section className="learn-layout"><LessonClient lessonId={lessonId} /><aside className="learn-side"><article><h3>Что запомнить</h3><p>Две фразы: 안녕하세요 и 저는 …이에요/예요. Произнеси их вслух, пока не станет легко. Акцент сейчас не важен.</p></article><article className="learn-scene-note"><b>Сцена после урока</b><p>После мини‑теста открой сцену «Новый друг»: там эти фразы звучат в диалоге.</p><Link href="/k-scene/new-friend">Открыть сцену →</Link></article></aside></section></main>
    <KTutor context="lesson-01" />
  </>;
}
