const initials = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const vowels = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const finals = ["", ..."ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"];

/** Splits a Hangul syllable into its letters; anything else comes back whole. */
export function decompose(character: string): string[] {
  const code = character.charCodeAt(0) - 0xac00;
  if (character.length !== 1 || code < 0 || code > 11171) return [character];
  return [initials[Math.floor(code / 588)], vowels[Math.floor(code / 28) % 21], finals[code % 28]].filter(Boolean);
}

// The Korean letter nearest in sound to each Latin or Cyrillic letter.
const sounds: Record<string, string> = {
  a: "ㅏ", b: "ㅂ", c: "ㅋ", d: "ㄷ", e: "ㅔ", f: "ㅍ", g: "ㄱ", h: "ㅎ", i: "ㅣ", j: "ㅈ", k: "ㅋ", l: "ㄹ", m: "ㅁ",
  n: "ㄴ", o: "ㅗ", p: "ㅍ", q: "ㅋ", r: "ㄹ", s: "ㅅ", t: "ㅌ", u: "ㅜ", v: "ㅂ", w: "ㅜ", x: "ㅆ", y: "ㅣ", z: "ㅈ",
  а: "ㅏ", б: "ㅂ", в: "ㅂ", г: "ㄱ", д: "ㄷ", е: "ㅔ", ё: "ㅛ", ж: "ㅈ", з: "ㅈ", и: "ㅣ", й: "ㅣ", к: "ㅋ", л: "ㄹ",
  м: "ㅁ", н: "ㄴ", о: "ㅗ", п: "ㅍ", р: "ㄹ", с: "ㅅ", т: "ㅌ", у: "ㅜ", ф: "ㅍ", х: "ㅎ", ц: "ㅉ", ч: "ㅊ", ш: "ㅅ",
  щ: "ㅆ", ы: "ㅡ", э: "ㅔ", ю: "ㅠ", я: "ㅑ",
};

export function soundOf(character: string) {
  return sounds[character.toLowerCase()];
}

/** Repeatable scatter, so the server and the browser agree. */
export function scatter(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}
