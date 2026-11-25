import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { activePlan } from "@/lib/plans";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { labSchema } from "@/lib/university-schema";

export async function PUT(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Нужно войти." }, { status: 401 });
  const parsed = labSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Некорректные данные." }, { status: 400 });

  const { saved, planner } = parsed.data;
  if (planner && activePlan(user.publicMetadata).plan !== "pro_plus") {
    return NextResponse.json({ error: "Эти инструменты доступны в Pro+." }, { status: 403 });
  }
  try {
    const supabase = await createServerSupabaseClient();
    // Columns that are left out keep their value, so a lapsed plan never loses its planner.
    const { error } = await supabase.from("university_lab").upsert({ user_id: user.id, saved, ...(planner && { planner }) }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("University Lab: save failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Не удалось сохранить." }, { status: 502 });
  }
}
