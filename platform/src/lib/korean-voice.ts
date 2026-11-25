export type Speaker = "female" | "male";
type VoiceInfo = Pick<SpeechSynthesisVoice, "name" | "lang">;

// Robotic voices that Apple lists before the normal one, and the open-source formant synthesiser.
const robotic = /^(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b|espeak/i;
const men = /injoon|hyunsu|bongjin|gookmin|minsu|\bmale\b|\bman\b|남성|남자/i;

function quality({ name }: VoiceInfo) {
  if (robotic.test(name)) return -1;
  if (/natural|neural|multilingual/i.test(name)) return 6;
  if (/siri|premium|프리미엄|премиум/i.test(name)) return 5;
  if (/enhanced|향상|улучшенн/i.test(name)) return 4;
  if (/google/i.test(name)) return 3;
  if (/yuna|유나|юна/i.test(name)) return 2;
  return 1;
}

/** The most natural Korean voice on the device. A man is used for a man's line only if he sounds natural too. */
export function pickKoreanVoice<Voice extends VoiceInfo>(voices: readonly Voice[], speaker: Speaker = "female"): Voice | undefined {
  const korean = voices.filter(({ lang }) => /^ko([-_]|$)/i.test(lang))
    .map((voice) => ({ voice, score: quality(voice), man: men.test(voice.name) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score);
  const best = korean[0];
  if (!best) return undefined;
  const wanted = korean.find(({ man }) => man === (speaker === "male"));
  return (wanted && wanted.score >= Math.min(4, best.score) ? wanted : best).voice;
}

const synthesis = () => typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : undefined;
// Browsers fill the list only after the first request for it.
synthesis()?.getVoices();

export function koreanUtterance(text: string, speaker?: Speaker) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickKoreanVoice(synthesis()?.getVoices() ?? [], speaker);
  utterance.lang = "ko-KR";
  utterance.rate = .88;
  if (voice) utterance.voice = voice;
  return utterance;
}

export function sayKorean(text: string) {
  const engine = synthesis();
  if (!engine) return;
  engine.cancel();
  engine.speak(koreanUtterance(text));
}
