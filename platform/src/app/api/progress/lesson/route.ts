import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const completionSchema = z.object({
  lessonId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Нужно войти в аккаунт." }, { status: 401 });

  const parsed = completionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Некорректные данные урока." }, { status: 400 });

  const failure = () => NextResponse.json({ error: "Не удалось сохранить результат." }, { status: 502 });
  const { lessonId, score } = parsed.data;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("xp_reward")
      .eq("id", lessonId)
      .eq("is_published", true)
      .maybeSingle();

    if (lessonError) return failure();
    if (!lesson) return NextResponse.json({ error: "Некорректные данные урока." }, { status: 404 });

    const key = { user_id: userId, lesson_id: lessonId };
    const completedAt = new Date().toISOString();
    const completion = {
      status: "completed",
      progress_percent: 100,
      score,
      xp_earned: lesson.xp_reward,
      completed_at: completedAt,
      updated_at: completedAt,
    };
    const { data: inserted, error: insertError } = await supabase
      .from("lesson_progress")
      .upsert({ ...key, ...completion }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true })
      .select("xp_earned")
      .maybeSingle();

    if (insertError) return failure();
    if (inserted) return NextResponse.json({ xpEarned: inserted.xp_earned });

    const { error: completionError } = await supabase
      .from("lesson_progress")
      .update(completion)
      .match(key)
      .neq("status", "completed");
    if (completionError) return failure();

    const { error: scoreError } = await supabase
      .from("lesson_progress")
      .update({ score, updated_at: new Date().toISOString() })
      .match(key)
      .eq("status", "completed")
      .or(`score.is.null,score.lt.${score}`);
    if (scoreError) return failure();

    const { data: saved, error: readError } = await supabase
      .from("lesson_progress")
      .select("xp_earned")
      .match(key)
      .single();
    if (readError) return failure();
    return NextResponse.json({ xpEarned: saved.xp_earned });
  } catch {
    return failure();
  }
}
