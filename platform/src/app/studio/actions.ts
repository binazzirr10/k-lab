"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(60),
  targetLevel: z.enum(["A1", "A2", "B1", "B2"]),
  dailyGoalMinutes: z.coerce.number().int().min(5).max(180),
});

export async function updateStudyProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    targetLevel: formData.get("targetLevel"),
    dailyGoalMinutes: formData.get("dailyGoalMinutes"),
  });

  if (!parsed.success) throw new Error("Проверь имя и учебную цель.");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      target_level: parsed.data.targetLevel,
      daily_goal_minutes: parsed.data.dailyGoalMinutes,
    })
    .eq("user_id", userId);

  if (error) throw new Error("Не удалось сохранить настройки.");
  revalidatePath("/studio");
}
