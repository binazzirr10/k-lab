import { kScenes } from "../k-scenes";
import { FREE_SCENE } from "../plans";

const editions = [
  {
    title: "A New Friend", location: "A morning on campus",
    romanization: ["Annyeonghaseyo. Jeoneun Minjiyeyo.", "Annyeonghaseyo.", "Ireumi mwoyeyo?", "Jeoneun Allinayeyo.", "Bangapseumnida. Haksaengieyo?", "Ne, haksaengieyo. Bangapseumnida."],
    english: ["Hello. I’m Minji.", "Hello.", "What’s your name?", "I’m Alina.", "Nice to meet you. Are you a student?", "Yes, I’m a student. Nice to meet you, too."],
  },
  {
    title: "Where Are You From?", location: "The university hall",
    romanization: ["Hanguk saramieyo?", "Anieyo.", "Eoneu nara saramieyo?", "Jeoneun Kajaheuseutan saramieyo.", "Minji ssineun Hanguk saramieyo?", "Ne, jeoneun Hanguk saramieyo."],
    english: ["Are you Korean?", "No.", "What country are you from?", "I’m from Kazakhstan.", "Minji, are you Korean?", "Yes, I’m Korean."],
  },
  {
    title: "What Is This?", location: "At a café after class",
    romanization: ["Minji ssi, igeoseun mwoyeyo?", "Igeoseun je chaegieyo.", "Jeogeoseun gabangieyo?", "Ne, majayo.", "Geugeoseun penieyo?", "Anieyo. Igeoseun yeonpirieyo."],
    english: ["Minji, what’s this?", "This is my book.", "Is that over there a bag?", "Yes, that’s right.", "Is that a pen?", "No. This is a pencil."],
  },
  {
    title: "Joon’s Day", location: "The language club",
    romanization: ["Annyeonghaseyo, Allina ssi. Oneul mwo haeyo?", "Jeoneun hangugeoreul gongbuhaeyo.", "Joayo. Jeoneun chingureul mannayo.", "Jeoneun keopireul masyeoyo.", "Gimbabeul meogeoyo?", "Ne, gimbabeul meogeoyo."],
    english: ["Hello, Alina. What are you doing today?", "I’m studying Korean.", "Nice. I’m meeting a friend.", "I drink coffee.", "Do you eat gimbap?", "Yes, I eat gimbap."],
  },
];

export const landingScenes = kScenes.map((scene, index) => ({
  ...scene,
  englishTitle: editions[index].title,
  englishLocation: editions[index].location,
  lines: scene.lines.map((line, lineIndex) => ({
    ...line,
    romanization: editions[index].romanization[lineIndex],
    english: editions[index].english[lineIndex],
  })),
}));

export type LandingScene = (typeof landingScenes)[number] & { locked: boolean };

/** Visitors get the free scene in full and the opening lines of the others. */
export const landingPreviews: LandingScene[] = landingScenes.map((scene) => {
  const locked = scene.slug !== FREE_SCENE;
  return { ...scene, locked, lines: locked ? scene.lines.slice(0, 2) : scene.lines };
});
