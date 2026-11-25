import { createServerSupabaseClient } from "./supabase/server";
import { readLab } from "./university-schema";

export async function loadUniversityLab(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("university_lab").select("saved, planner").eq("user_id", userId).maybeSingle();
    if (error) throw new Error(error.message);
    return { ...readLab(data), connected: true };
  } catch (error) {
    console.error("University Lab: load failed:", error instanceof Error ? error.message : error);
    return { ...readLab(null), connected: false };
  }
}
