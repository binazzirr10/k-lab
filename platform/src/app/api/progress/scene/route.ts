import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { kScenes } from "@/lib/k-scenes";
import { activePlan, canOpenScene } from "@/lib/plans";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({ sceneId: z.string().uuid(), score: z.number().int().min(0).max(100) });

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Нужно войти." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Некорректная сцена." }, { status: 400 });

  const failure = () => NextResponse.json({ error: "Не удалось сохранить сцену." }, { status: 502 });
  const { sceneId, score } = parsed.data;
  const userId = user.id;
  const scene = kScenes.find((item) => item.id === sceneId);
  if (!scene) return NextResponse.json({ error: "Некорректная сцена." }, { status: 400 });
  if (!canOpenScene(activePlan(user.publicMetadata).plan, scene.slug)) {
    return NextResponse.json({ error: "Эта сцена доступна в Pro." }, { status: 403 });
  }
  try {
    const supabase = await createServerSupabaseClient();
    const key = { user_id: userId, scene_id: sceneId };
    const completedAt = new Date().toISOString();
    const { data: inserted, error: insertError } = await supabase
      .from("scene_progress")
      .upsert({ ...key, best_score: score, completed_at: completedAt }, {
        onConflict: "user_id,scene_id",
        ignoreDuplicates: true,
      })
      .select("scene_id")
      .maybeSingle();

    if (insertError) return failure();
    if (!inserted) {
      const { error: scoreError } = await supabase
        .from("scene_progress")
        .update({ best_score: score })
        .match(key)
        .or(`best_score.is.null,best_score.lt.${score}`);
      if (scoreError) return failure();

      const { error: completionError } = await supabase
        .from("scene_progress")
        .update({ completed_at: completedAt })
        .match(key)
        .is("completed_at", null);
      if (completionError) return failure();
    }
    return NextResponse.json({ ok: true });
  } catch {
    return failure();
  }
}
