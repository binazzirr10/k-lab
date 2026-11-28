import { kScenes } from "./k-scenes";
import { phrases } from "./content/phrases";
import { landingScenes } from "./landing/scenes";
import { practicePhrases, type PracticeLine, type PracticePhrase } from "./landing/phrases";

const normal = (text: string) => text.replace(/[.?!]+$/, "").replace(/\s+/g, " ").trim();

/** Every course line with its reading and translation, keyed by the Korean text without the final mark. */
const known = new Map<string, PracticeLine>();
for (const scene of landingScenes) for (const line of scene.lines) known.set(normal(line.text), line);
for (const scene of kScenes) for (const line of scene.lines) if (!known.has(normal(line.text))) known.set(normal(line.text), { text: line.text, translation: line.translation, english: "" });
for (const phrase of phrases) if (!known.has(normal(phrase.korean))) known.set(normal(phrase.korean), { text: phrase.korean, romanization: phrase.romanization, translation: phrase.russian, english: "" });

/** Hangul, spaces and ordinary punctuation only: the phrase comes from a link anyone can edit. */
const valid = /^[\uAC00-\uD7A3\u3131-\u318E\s.,?!~]{1,80}$/;

/** The phrase a lesson sent comes first; the usual set follows. */
export function practiceFor(phrase: string | undefined): PracticePhrase[] {
  const text = phrase?.trim();
  if (!text || !valid.test(text)) return practicePhrases;
  const line = known.get(normal(text)) ?? { text, translation: "", english: "" };
  return [{ line }, ...practicePhrases.filter((item) => normal(item.line.text) !== normal(text))];
}
