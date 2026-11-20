import { getScene } from "./k-scenes";

// Tutor contexts live here, not in the browser request: the client only sends
// an id, so nobody can rewrite the tutor's instructions through the API.
const staticContexts = {
  "lesson-01": {
    label: "LESSON 01 · ЗНАКОМСТВО",
    prompt: "Lesson 01: знакомство. Фразы 안녕하세요, 저는 ...예요. Грамматика 이에요/예요 и 저는.",
  },
  "lesson-02": {
    label: "LESSON 02 · СТРАНЫ",
    prompt: "Lesson 02: страны. Фразы 어느 나라 사람이에요?, 저는 카자흐스탄 사람이에요, 아니에요.",
  },
  "lesson-03": {
    label: "LESSON 03 · ПРЕДМЕТЫ",
    prompt: "Lesson 03: предметы. Помоги с фразами 이것은 책이에요, 이것은 가방이에요 и разницей 이것/그것/저것.",
  },
  "lesson-04": {
    label: "LESSON 04 · МОЙ ДЕНЬ",
    prompt: "Lesson 04: распорядок дня. Фразы 한국어를 공부해요, 커피를 마셔요, 김밥을 먹어요, 친구를 만나요. Объясняй -아요/어요 просто.",
  },
  "checkpoint-01": {
    label: "CHECKPOINT 01",
    prompt: "Checkpoint 01. Не давай готовые ответы. Объясни правило или дай маленькую подсказку по фразе, если ученик попросит.",
  },
  "k-scene-hub": {
    label: "K‑SCENE",
    prompt: "K-Scene hub. Помоги пользователю понять реплику перед началом сцены.",
  },
  "word-deck": {
    label: "WORD DECK",
    prompt: "Word Deck. Помоги запомнить слово: объясни его просто, дай одну короткую фразу и не перегружай ученика.",
  },
  studio: {
    label: "МОЙ РИТМ",
    prompt: "Пользователь находится в личном кабинете K-Lab. Помоги выбрать следующий шаг, объясни корейскую фразу или составь короткий план практики.",
  },
} as const;

export type StaticTutorContextId = keyof typeof staticContexts;
export type TutorContextId = StaticTutorContextId | `scene:${string}`;
export type TutorContext = { label: string; prompt: string };

const SCENE_PREFIX = "scene:";

export function resolveTutorContext(id: string): TutorContext | null {
  if (id.startsWith(SCENE_PREFIX)) {
    const scene = getScene(id.slice(SCENE_PREFIX.length));
    if (!scene) return null;
    return {
      label: `K‑SCENE · ${scene.title.toUpperCase()}`,
      prompt: `K-Scene: ${scene.title}. Объясняй реплики из этой сцены и предлагай короткую подсказку для shadowing.`,
    };
  }
  return Object.hasOwn(staticContexts, id) ? staticContexts[id as StaticTutorContextId] : null;
}
