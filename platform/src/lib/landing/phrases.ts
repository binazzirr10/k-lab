import { landingScenes } from "./scenes";

export const practicePhrases = [
  { line: landingScenes[0].lines[1], cue: landingScenes[0].lines[0] },
  { line: landingScenes[0].lines[3], cue: landingScenes[0].lines[2] },
  { line: landingScenes[0].lines[5], cue: landingScenes[0].lines[4] },
  { line: landingScenes[1].lines[1], cue: landingScenes[1].lines[0] },
  { line: landingScenes[1].lines[3], cue: landingScenes[1].lines[2] },
  { line: landingScenes[3].lines[1], cue: { text: "오늘 뭐 해요?", english: "What are you doing today?", translation: "Что вы делаете сегодня?" } },
];

export type PracticePhrases = typeof practicePhrases;
