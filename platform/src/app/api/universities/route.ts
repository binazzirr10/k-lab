import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { activePlan } from "@/lib/plans";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loadUniversityLab } from "@/lib/university-lab";
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
  const revision = request.headers.get("If-Match");
  if (revision !== null && (planner || !/^"(?:new|\d{4}-\d\d-\d\dT[\d:.+-]+Z?)"$/.test(revision))) {
    return NextResponse.json({ error: "Некорректные данные." }, { status: 400 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (revision !== null) {
      const shortlist = supabase.from("university_lab");
      // Guard the article's full-list update against saves made since it was opened.
      const update = revision === '"new"'
        ? shortlist.upsert({ user_id: user.id, saved }, { onConflict: "user_id", ignoreDuplicates: true })
        : shortlist.update({ saved }).eq("user_id", user.id).eq("updated_at", revision.slice(1, -1));
      const { data, error } = await update.select("user_id").maybeSingle();
      if (error) throw new Error(error.message);
      if (data) return NextResponse.json({ ok: true });

      const current = await loadUniversityLab(user.id);
      if (!current.connected) throw new Error("Could not reload the current shortlist");
      return NextResponse.json({ saved: current.saved, revision: current.revision }, { status: 412 });
    }

    // Columns that are left out keep their value, so a lapsed plan never loses its planner.
    const { error } = await supabase.from("university_lab").upsert({ user_id: user.id, saved, ...(planner && { planner }) }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("University Lab: save failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Не удалось сохранить." }, { status: 502 });
  }
}
