export const initials = [..."ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"];
export const vowels = [..."ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"];
export const finals = ["", ..."ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"];

export function composeSyllable(initial: number, vowel: number, final: number): string {
  return String.fromCharCode(0xac00 + (initial * 21 + vowel) * 28 + final);
}

export function decomposeSyllable(syllable: string): [number, number, number] {
  const index = syllable.charCodeAt(0) - 0xac00;
  return [Math.floor(index / 588), Math.floor(index / 28) % 21, index % 28];
}

export const wordPresets = [
  { id: "preset-korea", word: "한국", translation: "Корея" },
  { id: "preset-hello", word: "안녕", translation: "привет" },
  { id: "preset-kimbap", word: "김밥", translation: "кимбап" },
  { id: "preset-friend", word: "친구", translation: "друг" },
  { id: "preset-seoul", word: "서울", translation: "Сеул" },
] as const;
