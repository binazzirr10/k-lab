import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const completionSchema = z.object({
  lessonId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
  xpReward: z.number().int().min(0).max(200),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Нужно войти в аккаунт." }, { status: 401 });

  const parsed = completionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Некорректные данные урока." }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { data: previous } = await supabase
    .from("lesson_progress")
    .select("status, xp_earned")
    .eq("user_id", userId)
    .eq("lesson_id", parsed.data.lessonId)
    .maybeSingle();

  const xpEarned = previous?.status === "completed" ? Number(previous.xp_earned || 0) : parsed.data.xpReward;
  const { error } = await supabase.from("lesson_progress").upsert({
    user_id: userId,
    lesson_id: parsed.data.lessonId,
    status: "completed",
    progress_percent: 100,
    score: parsed.data.score,
    xp_earned: xpEarned,
    completed_at: new Date().toISOString(),
  }, { onConflict: "user_id,lesson_id" });

  if (error) return NextResponse.json({ error: "Не удалось сохранить результат." }, { status: 502 });
  return NextResponse.json({ xpEarned });
}
