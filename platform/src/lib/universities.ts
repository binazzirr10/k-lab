export const fields = [
  ["engineering", "Инженерия и IT"],
  ["science", "Естественные науки"],
  ["business", "Бизнес и экономика"],
  ["language", "Языки и регионоведение"],
  ["art", "Дизайн и искусство"],
  ["media", "Медиа и кино"],
  ["social", "Гуманитарные и социальные науки"],
  ["medicine", "Медицина и фармация"],
] as const;
export type Field = (typeof fields)[number][0];
export const fieldName = (id: Field) => fields.find(([field]) => field === id)?.[1] ?? id;

export type University = { id: string; name: string; korean: string; city: string; about: string; fields: Field[]; url: string };

/** Only facts that do not change every year. Tuition, scores and deadlines are left to the official sites. */
export const universityCatalog: University[] = [
  { id: "snu", name: "Seoul National University", korean: "서울대학교", city: "Сеул", about: "Естественные науки, инженерия, гуманитарные и социальные науки.", fields: ["science", "engineering", "social", "business"], url: "https://en.snu.ac.kr/admission" },
  { id: "yonsei", name: "Yonsei University", korean: "연세대학교", city: "Сеул", about: "Международные исследования, бизнес, медиа, науки и языковые программы.", fields: ["business", "language", "media", "science", "social"], url: "https://admission.yonsei.ac.kr/seoul/" },
  { id: "korea", name: "Korea University", korean: "고려대학교", city: "Сеул", about: "Бизнес, международные отношения, право и журналистика.", fields: ["business", "social", "media", "engineering"], url: "https://oia.korea.ac.kr/" },
  { id: "kaist", name: "KAIST", korean: "한국과학기술원", city: "Тэджон", about: "Естественные науки, инженерия, информатика и ИИ.", fields: ["science", "engineering"], url: "https://admission.kaist.ac.kr/intl-undergraduate/" },
  { id: "postech", name: "POSTECH", korean: "포항공과대학교", city: "Пхохан", about: "Науки, инженерия, ИИ, материалы и исследовательские программы.", fields: ["science", "engineering"], url: "https://www.postech.ac.kr/" },
  { id: "unist", name: "UNIST", korean: "울산과학기술원", city: "Ульсан", about: "Науки, инженерия, технологии и ИИ.", fields: ["science", "engineering"], url: "https://www.unist.ac.kr/" },
  { id: "skku", name: "Sungkyunkwan University", korean: "성균관대학교", city: "Сеул и Сувон", about: "Технологии, естественные науки, бизнес и гуманитарные программы.", fields: ["engineering", "science", "business", "social"], url: "https://admission-global.skku.edu/" },
  { id: "hanyang", name: "Hanyang University", korean: "한양대학교", city: "Сеул", about: "Инженерия, IT, архитектура и прикладные технологии.", fields: ["engineering"], url: "https://www.hanyang.ac.kr/" },
  { id: "sogang", name: "Sogang University", korean: "서강대학교", city: "Сеул", about: "Бизнес, медиа, международные исследования и корейский язык.", fields: ["business", "media", "language"], url: "https://www.sogang.ac.kr/" },
  { id: "ewha", name: "Ewha Womans University", korean: "이화여자대학교", city: "Сеул", about: "Женский университет: бизнес, дизайн, медиа, языки и социальные программы.", fields: ["business", "art", "media", "language", "social"], url: "https://www.ewha.ac.kr/" },
  { id: "kyunghee", name: "Kyung Hee University", korean: "경희대학교", city: "Сеул", about: "Международные отношения, медицина, туризм, бизнес и искусство.", fields: ["social", "medicine", "business", "art"], url: "https://www.khu.ac.kr/" },
  { id: "chungang", name: "Chung-Ang University", korean: "중앙대학교", city: "Сеул", about: "Медиа, кино, бизнес, инженерия и гуманитарные науки.", fields: ["media", "business", "engineering", "social"], url: "https://www.cau.ac.kr/" },
  { id: "dongguk", name: "Dongguk University", korean: "동국대학교", city: "Сеул", about: "Кино, медиа, бизнес, IT и междисциплинарные программы.", fields: ["media", "business", "engineering"], url: "https://www.dongguk.edu/" },
  { id: "hongik", name: "Hongik University", korean: "홍익대학교", city: "Сеул", about: "Дизайн, архитектура, искусство, визуальные коммуникации и инженерия.", fields: ["art", "engineering"], url: "https://www.hongik.ac.kr/" },
  { id: "hufs", name: "Hankuk University of Foreign Studies", korean: "한국외국어대학교", city: "Сеул", about: "Языки, перевод, международные отношения и регионоведение.", fields: ["language", "social"], url: "https://www.hufs.ac.kr/" },
  { id: "konkuk", name: "Konkuk University", korean: "건국대학교", city: "Сеул", about: "Бизнес, науки о жизни, инженерия, медиа и гуманитарные программы.", fields: ["business", "science", "engineering", "media", "social"], url: "https://www.konkuk.ac.kr/" },
  { id: "kookmin", name: "Kookmin University", korean: "국민대학교", city: "Сеул", about: "Дизайн, автомобилестроение, бизнес, IT и гуманитарные программы.", fields: ["art", "engineering", "business", "social"], url: "https://www.kookmin.ac.kr/" },
  { id: "seoultech", name: "SeoulTech", korean: "서울과학기술대학교", city: "Сеул", about: "Технологии, инженерия, дизайн и прикладные науки.", fields: ["engineering", "art", "science"], url: "https://en.seoultech.ac.kr/" },
  { id: "uos", name: "University of Seoul", korean: "서울시립대학교", city: "Сеул", about: "Урбанистика, инженерия, государственное управление, науки и дизайн.", fields: ["engineering", "social", "science", "art"], url: "https://www.uos.ac.kr/" },
  { id: "inha", name: "Inha University", korean: "인하대학교", city: "Инчхон", about: "Инженерия, логистика, авиация, IT, бизнес и естественные науки.", fields: ["engineering", "business", "science"], url: "https://www.inha.ac.kr/" },
  { id: "ajou", name: "Ajou University", korean: "아주대학교", city: "Сувон", about: "Инженерия, медицина, IT, бизнес и международные программы.", fields: ["engineering", "medicine", "business"], url: "https://www.ajou.ac.kr/" },
  { id: "pusan", name: "Pusan National University", korean: "부산대학교", city: "Пусан", about: "Инженерия, науки, фармация и гуманитарные направления.", fields: ["engineering", "science", "medicine", "social"], url: "https://www.pusan.ac.kr/" },
  { id: "knu", name: "Kyungpook National University", korean: "경북대학교", city: "Тэгу", about: "Инженерия, медицина, науки и гуманитарные программы.", fields: ["engineering", "medicine", "science", "social"], url: "https://www.knu.ac.kr/" },
  { id: "chonnam", name: "Chonnam National University", korean: "전남대학교", city: "Кванджу", about: "Науки, инженерия, сельское хозяйство, медицина и гуманитарные программы.", fields: ["science", "engineering", "medicine", "social"], url: "https://www.jnu.ac.kr/" },
  { id: "jeju", name: "Jeju National University", korean: "제주대학교", city: "Чеджу", about: "Науки, туризм, морские исследования и региональные программы.", fields: ["science", "business"], url: "https://www.jejunu.ac.kr/" },
];

export const cities = [...new Set(universityCatalog.flatMap(({ city }) => city.split(" и ")))];

export const documents = [
  ["passport", "Загранпаспорт"],
  ["diploma", "Аттестат или диплом с переводом"],
  ["transcript", "Выписка с оценками"],
  ["language", "Подтверждение языка (TOPIK или английский)"],
  ["letter", "Мотивационное письмо"],
  ["recommendation", "Рекомендации, если их просит программа"],
  ["finance", "Финансовые документы, если их просит университет"],
] as const;

export const steps = [
  ["field", "Выбрать направление и уровень обучения"],
  ["shortlist", "Собрать список из 3–5 университетов"],
  ["requirements", "Проверить требования и сроки на официальных сайтах"],
  ["papers", "Подготовить документы и переводы"],
  ["apply", "Подать заявление через официальный канал"],
  ["visa", "После зачисления узнать порядок визы D-2 в консульстве"],
] as const;

export const statuses = [["thinking", "Изучаю"], ["preparing", "Готовлю документы"], ["applied", "Документы поданы"], ["answer", "Есть ответ"]] as const;
export type Status = (typeof statuses)[number][0];
export type Entry = { status: Status; deadline: string; note: string };
export type Planner = { field: Field | ""; city: string; compare: string[]; done: string[]; entries: Record<string, Entry> };
export const emptyPlanner: Planner = { field: "", city: "", compare: [], done: [], entries: {} };
export const emptyEntry: Entry = { status: "thinking", deadline: "", note: "" };
export const COMPARE_LIMIT = 3;
export const NOTE_LIMIT = 300;

/** The chosen field matters most, then the city; a narrower university wins a tie. */
export function matchUniversities(field: Planner["field"], city: string) {
  if (!field && !city) return [];
  return universityCatalog
    .map((university) => {
      const inField = !!field && university.fields.includes(field);
      const inCity = !!city && university.city.includes(city);
      return { university, inField, inCity, score: (inField ? 2 : 0) + (inCity ? 1 : 0) };
    })
    .filter(({ inField, inCity }) => (field ? inField : inCity))
    .sort((a, b) => b.score - a.score || a.university.fields.length - b.university.fields.length)
    .slice(0, 6);
}

export function readiness(done: string[]) {
  const count = documents.filter(([id]) => done.includes(id)).length;
  return { count, total: documents.length, percent: Math.round(count / documents.length * 100) };
}
