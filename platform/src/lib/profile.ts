import { createServerSupabaseClient } from "./supabase/server";

export type StudentProfile = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  native_language: string;
  target_level: string;
  daily_goal_minutes: number;
};

type ProfileSeed = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

export async function getOrCreateStudentProfile(seed: ProfileSeed) {
  const supabase = await createServerSupabaseClient();
  const selection = "user_id, display_name, avatar_url, native_language, target_level, daily_goal_minutes";

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select(selection)
    .eq("user_id", seed.userId)
    .maybeSingle();

  if (readError) return { profile: null, connected: false };
  if (existing) return { profile: existing as StudentProfile, connected: true };

  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert({
      user_id: seed.userId,
      display_name: seed.displayName,
      avatar_url: seed.avatarUrl,
    })
    .select(selection)
    .single();

  if (createError) return { profile: null, connected: false };
  return { profile: created as StudentProfile, connected: true };
}
