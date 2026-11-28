import { createServerSupabaseClient } from "./supabase/server";
import { readLab } from "./university-schema";

export async function loadUniversityLab(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("university_lab").select("saved, planner, updated_at").eq("user_id", userId).maybeSingle();
    if (error) throw new Error(error.message);
    const revision = typeof data?.updated_at === "string" ? data.updated_at : null;
    return { ...readLab(data), revision, connected: true };
  } catch (error) {
    console.error("University Lab: load failed:", error instanceof Error ? error.message : error);
    return { ...readLab(null), revision: null, connected: false };
  }
}
