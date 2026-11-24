import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { paidPlanSchema } from "@/lib/plan-schema";
import { activePlan, nextExpiry } from "@/lib/plans";

const userId = z.string().regex(/^user_[A-Za-z0-9]{1,64}$/);
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("grant"), userId, plan: paidPlanSchema, months: z.union([z.literal(1), z.literal(3), z.literal(12)]) }),
  z.object({ action: z.literal("revoke"), userId }),
  z.object({ action: z.literal("dismiss"), userId }),
]);

export async function POST(request: Request) {
  const admin = await currentUser();
  if (!admin) return NextResponse.json({ error: "Нужно войти." }, { status: 401 });
  if (String(admin.publicMetadata.role ?? "").toLowerCase() !== "admin") {
    return NextResponse.json({ error: "Нет доступа." }, { status: 403 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });

  try {
    const { users } = await clerkClient();
    const input = parsed.data;
    if (input.action === "dismiss") {
      await users.updateUserMetadata(input.userId, { privateMetadata: { planRequest: null } });
    } else if (input.action === "revoke") {
      await users.updateUserMetadata(input.userId, { publicMetadata: { plan: null, planUntil: null } });
    } else {
      const current = activePlan((await users.getUser(input.userId)).publicMetadata);
      await users.updateUserMetadata(input.userId, {
        publicMetadata: { plan: input.plan, planUntil: nextExpiry(current, input.plan, input.months) },
        privateMetadata: { planRequest: null },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Plan change failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Не удалось изменить тариф." }, { status: 502 });
  }
}
