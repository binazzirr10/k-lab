import { z } from "zod";

/** Kept apart from plans.ts so that pages do not ship the validator. */
export const paidPlanSchema = z.enum(["pro", "pro_plus"]);
