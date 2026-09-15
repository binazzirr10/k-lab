import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const reviewSchema = z.object({ itemId: z.string().uuid(), state: z.enum(["learning", "known", "review"]) });

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Нужно войти в аккаунт." }, { status: 401 });
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Некорректная карточка." }, { status: 400 });
  const { itemId, state } = parsed.data;
  const days = state === "known" ? 7 : state === "review" ? 1 : 2;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("vocabulary_reviews").upsert({ user_id: userId, item_id: itemId, state, repetitions: state === "known" ? 3 : 1, interval_days: days, next_review_at: new Date(Date.now() + days * 86400000).toISOString(), last_reviewed_at: new Date().toISOString() }, { onConflict: "user_id,item_id" });
  if (error) return NextResponse.json({ error: "Не получилось сохранить карточку." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
