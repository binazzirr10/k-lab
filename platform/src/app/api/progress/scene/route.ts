import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
const schema = z.object({ sceneId: z.string().uuid(), score: z.number().int().min(0).max(100) });
export async function POST(request: Request) { const { userId } = await auth(); if (!userId) return NextResponse.json({ error:"Нужно войти." },{status:401}); const parsed=schema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return NextResponse.json({error:"Некорректная сцена."},{status:400}); const supabase=await createServerSupabaseClient(); const { error }=await supabase.from("scene_progress").upsert({user_id:userId,scene_id:parsed.data.sceneId,completed_at:new Date().toISOString(),best_score:parsed.data.score},{onConflict:"user_id,scene_id"}); if(error)return NextResponse.json({error:"Не удалось сохранить сцену."},{status:502}); return NextResponse.json({ok:true}); }
