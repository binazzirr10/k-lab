import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { paidPlanSchema } from "@/lib/plan-schema";
import { activePlan } from "@/lib/plans";

const schema = z.object({ plan: paidPlanSchema });

/** Nothing is charged: the request waits for an administrator. */
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Нужно войти." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Такого тарифа нет." }, { status: 400 });

  const { plan } = parsed.data;
  const active = activePlan(user.publicMetadata).plan;
  if (active === plan || (active === "pro_plus" && plan === "pro")) {
    return NextResponse.json({ error: "Этот тариф уже подключён." }, { status: 409 });
  }
  const pending = user.privateMetadata.planRequest as { plan?: string } | undefined;
  if (pending?.plan === plan) return NextResponse.json({ ok: true });
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, { privateMetadata: { planRequest: { plan, at: new Date().toISOString() } } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Plan request failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Не удалось отправить заявку. Попробуй позже." }, { status: 502 });
  }
}
