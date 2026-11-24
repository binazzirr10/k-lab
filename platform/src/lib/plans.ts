export const planIds = ["free", "pro", "pro_plus"] as const;
export type PlanId = (typeof planIds)[number];
export type PaidPlan = Exclude<PlanId, "free">;

export const FREE_SCENE = "new-friend";
export const FREE_SPEAKING_PER_DAY = 3;

/** `soon` marks what is promised by the plan but not built yet. It must be shown as such. */
type Feature = { en: string; ru: string; soon?: true };
export type Plan = {
  id: PlanId; name: string; price: number;
  note: { en: string; ru: string };
  features: Feature[];
};

export const plans: Plan[] = [
  {
    id: "free", name: "Free", price: 0, note: { en: "Forever", ru: "Навсегда" },
    features: [
      { en: "All of Hangul", ru: "Хангыль полностью" },
      { en: "A1: the first 4 lessons", ru: "A1: первые 4 урока" },
      { en: "Word Deck: basic A1 words", ru: "Word Deck: базовые слова A1" },
      { en: "1 K-Drama scene", ru: "1 K-Drama сцена" },
      { en: "3 Speaking attempts a day", ru: "3 Speaking-попытки в день" },
      { en: "University directory", ru: "Каталог университетов" },
      { en: "TOPIK mini-test", ru: "Пробный мини-тест TOPIK", soon: true },
    ],
  },
  {
    id: "pro", name: "Pro", price: 2490, note: { en: "a month", ru: "в месяц" },
    features: [
      { en: "All K-Drama scenes", ru: "Все K-Drama сцены" },
      { en: "Unlimited Speaking attempts", ru: "Speaking без дневного лимита" },
      { en: "All courses, A1–B2", ru: "Все курсы A1–B2", soon: true },
      { en: "All words and examples", ru: "Все слова и примеры", soon: true },
      { en: "AI Speaking: 30 minutes a month", ru: "AI Speaking: 30 минут в месяц", soon: true },
      { en: "TOPIK practice", ru: "TOPIK Practice", soon: true },
      { en: "Progress and mistake review", ru: "Прогресс и повторение ошибок", soon: true },
    ],
  },
  {
    id: "pro_plus", name: "Pro+", price: 4490, note: { en: "a month", ru: "в месяц" },
    features: [
      { en: "Everything in Pro", ru: "Всё из Pro" },
      { en: "AI Speaking: 120 minutes a month", ru: "AI Speaking: 120 минут в месяц", soon: true },
      { en: "Personal AI conversation partner", ru: "Персональный AI-собеседник", soon: true },
      { en: "TOPIK mock exams with mistake analysis", ru: "TOPIK Mock Exams с разбором ошибок", soon: true },
      { en: "University Hub Pro: matching and checklists", ru: "University Hub Pro: подбор вузов и чек-листы", soon: true },
      { en: "Personal study recommendations", ru: "Персональные рекомендации по обучению", soon: true },
    ],
  },
];

export const comparison: { section: string; free: string; paid: string; soon: boolean }[] = [
  { section: "Хангыль", free: "Полностью", paid: "Полностью", soon: false },
  { section: "Грамматика", free: "Основы A1", paid: "A1–B2, упражнения и тесты", soon: true },
  { section: "Слова", free: "Базовые слова A1", paid: "Все уровни, TOPIK, интервальные повторения", soon: true },
  { section: "Speaking Lab", free: "3 попытки в день", paid: "Без дневного лимита; AI-разговоры позже", soon: false },
  { section: "K-Drama", free: "1 сцена", paid: "Все сцены", soon: false },
  { section: "TOPIK", free: "Мини-тест (скоро)", paid: "Полные тесты и анализ ошибок", soon: true },
  { section: "University Hub", free: "Каталог университетов", paid: "Подбор программ, требования, чек-листы", soon: true },
  { section: "Прогресс", free: "Пройденные уроки", paid: "Анализ ошибок, рекомендации", soon: true },
];

/** Reads Clerk's public metadata, which only the server can write. Anything invalid or expired is Free. */
export function activePlan(metadata: unknown, now = new Date()): { plan: PlanId; until: string | null } {
  const { plan, planUntil } = (metadata ?? {}) as { plan?: unknown; planUntil?: unknown };
  const valid = (plan === "pro" || plan === "pro_plus") && typeof planUntil === "string" && Date.parse(planUntil) > now.getTime();
  return valid ? { plan, until: planUntil } : { plan: "free", until: null };
}

export const planName = (id: PlanId) => plans.find((plan) => plan.id === id)?.name ?? "Free";
export const canOpenScene = (plan: PlanId, slug: string) => plan !== "free" || slug === FREE_SCENE;
export const formatTenge = (price: number) => `${price.toLocaleString("ru-RU").replace(/\s/g, " ")} ₸`;

/** A renewal of the same plan continues from the paid date instead of losing the days that are left. */
export function nextExpiry(current: { plan: PlanId; until: string | null }, plan: PaidPlan, months: number, now = new Date()) {
  const start = current.plan === plan && current.until ? new Date(current.until) : now;
  const day = start.getUTCDate();
  const end = new Date(start);
  end.setUTCDate(1);
  end.setUTCMonth(end.getUTCMonth() + months);
  end.setUTCDate(Math.min(day, new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate()));
  return end.toISOString();
}
