import { z } from "zod";
import { cities, COMPARE_LIMIT, documents, emptyPlanner, fields, NOTE_LIMIT, statuses, steps, universityCatalog, type Planner } from "./universities";

const ids = new Set(universityCatalog.map(({ id }) => id));
const doneIds = new Set<string>([...documents, ...steps].map(([id]) => id));
const id = z.string().refine((value) => ids.has(value));
const unique = (list: string[]) => new Set(list).size === list.length;

export const savedSchema = z.array(id).max(universityCatalog.length).refine(unique);
export const plannerSchema = z.strictObject({
  field: z.enum(fields.map(([value]) => value)).or(z.literal("")),
  city: z.string().refine((value) => value === "" || cities.includes(value)),
  compare: z.array(id).max(COMPARE_LIMIT).refine(unique),
  done: z.array(z.string().refine((value) => doneIds.has(value))).max(doneIds.size).refine(unique),
  entries: z.record(id, z.strictObject({
    status: z.enum(statuses.map(([value]) => value)),
    deadline: z.iso.date().or(z.literal("")),
    note: z.string().max(NOTE_LIMIT),
  })),
});
export const labSchema = z.strictObject({ saved: savedSchema, planner: plannerSchema.optional() });

/** Stored data may be older than the code, so anything unreadable falls back to empty. */
export function readLab(row: { saved?: unknown; planner?: unknown } | null): { saved: string[]; planner: Planner } {
  const saved = z.array(z.string()).safeParse(row?.saved);
  const planner = plannerSchema.safeParse(row?.planner);
  return { saved: saved.success ? saved.data.filter((value) => ids.has(value)) : [], planner: planner.success ? planner.data as Planner : emptyPlanner };
}
