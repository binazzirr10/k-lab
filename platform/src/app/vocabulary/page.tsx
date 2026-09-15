import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { WordDeckStyleFix } from "@/app/components/word-deck-style-fix";
import { WordDeckClient } from "./word-deck-client";

export default async function VocabularyPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  let savedStates: Record<string, string> = {};
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("vocabulary_reviews").select("item_id,state").eq("user_id", userId);
    savedStates = Object.fromEntries((data ?? []).map((review) => [review.item_id, review.state]));
  } catch { /* The deck is still usable before the first database sync. */ }
  return <><LessonStyleFix /><WordDeckStyleFix />
    <nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a href="/learn/lesson-01-introduction">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a className="active" href="/vocabulary">WORD DECK</a><a href="https://k-lab-two.vercel.app/kdrama.html">K‑DRAMA</a></div><section><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></section></nav>
    <main className="deck-wrap"><header className="deck-hero"><div><span>WORD DECK · LEVEL 01</span><h1>Слова, которые<br />останутся с тобой.</h1><p>Выбирай тему, слушай произношение, отмечай карточки и возвращайся к словам, которые нужно повторить.</p></div><div className="deck-stats"><div><b>24</b><small>СЛОВА В LEVEL 01</small></div><div><b>{Object.values(savedStates).filter((state) => state === "known").length}</b><small>УЖЕ ВЫУЧЕНО</small></div><div><b>{Object.values(savedStates).filter((state) => state === "review").length}</b><small>ЖДУТ ПОВТОРА</small></div></div></header><WordDeckClient initialStates={savedStates} /></main>
    <KTutor lessonContext="Word Deck. Помоги запомнить слово: объясни его просто, дай одну короткую фразу и не перегружай ученика." />
  </>;
}
