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
  const failure = () => NextResponse.json({ error: "Не получилось сохранить карточку." }, { status: 502 });

  try {
    const supabase = await createServerSupabaseClient();
    const key = { user_id: userId, item_id: itemId };

    // Retry if another review inserted or changed the row since it was read.
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: previous, error: readError } = await supabase
        .from("vocabulary_reviews")
        .select("repetitions")
        .match(key)
        .maybeSingle();
      if (readError) return failure();

      const now = Date.now();
      const review = {
        state,
        repetitions: (previous?.repetitions ?? 0) + 1,
        interval_days: days,
        next_review_at: new Date(now + days * 86400000).toISOString(),
        last_reviewed_at: new Date(now).toISOString(),
      };
      const write = previous
        ? supabase.from("vocabulary_reviews").update(review).match(key).eq("repetitions", previous.repetitions)
        : supabase.from("vocabulary_reviews").upsert({ ...key, ...review }, {
          onConflict: "user_id,item_id",
          ignoreDuplicates: true,
        });

      const { data: saved, error: writeError } = await write.select("item_id").maybeSingle();
      if (writeError) return failure();
      if (saved) return NextResponse.json({ ok: true });
    }
    return failure();
  } catch {
    return failure();
  }
}
