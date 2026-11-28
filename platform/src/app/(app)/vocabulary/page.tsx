import { signInFor } from "@/lib/sign-in";
import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { WordDeckClient } from "./word-deck-client";

export default async function VocabularyPage() {
  const { userId } = await auth();
  if (!userId) redirect(signInFor("/vocabulary"));
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";
  let savedStates: Record<string, string> = {};
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("vocabulary_reviews").select("item_id,state").eq("user_id", userId);
    savedStates = Object.fromEntries((data ?? []).map((review) => [review.item_id, review.state]));
  } catch { /* The deck is still usable before the first database sync. */ }
  return <>
    <AppNav active="words"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
    <main className="deck-wrap"><WordDeckClient initialStates={savedStates} intro={<div><span>Word Deck · A1</span><h1>Слова к четырём урокам</h1><p>Выбери тему, послушай фразу с новым словом и отметь, знаешь ты его или хочешь повторить.</p></div>} /></main>
    <KTutor context="word-deck" />
  </>;
}
