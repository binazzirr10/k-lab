export const universities = [
  {
    name: "Seoul National University", korean: "서울대학교",
    city: { en: "Seoul", ru: "Сеул" },
    areas: { en: "Sciences, engineering, humanities and social sciences.", ru: "Естественные науки, инженерия, гуманитарные и социальные науки." },
    admissions: "https://en.snu.ac.kr/admission",
  },
  {
    name: "Yonsei University", korean: "연세대학교",
    city: { en: "Seoul", ru: "Сеул" },
    areas: { en: "International studies, business, media and language programs.", ru: "Международные исследования, бизнес, медиа и языковые программы." },
    admissions: "https://admission.yonsei.ac.kr/seoul/",
  },
  {
    name: "Korea University", korean: "고려대학교",
    city: { en: "Seoul", ru: "Сеул" },
    areas: { en: "Business, international relations, law and journalism.", ru: "Бизнес, международные отношения, право и журналистика." },
    admissions: "https://oia.korea.ac.kr/",
  },
  {
    name: "KAIST", korean: "한국과학기술원",
    city: { en: "Daejeon", ru: "Тэджон" },
    areas: { en: "Science, engineering and computer science.", ru: "Естественные науки, инженерия и информатика." },
    language: { en: "English-taught programs are available. Check the official page for your program.", ru: "Есть программы на английском языке. Уточни язык своей программы на официальном сайте." },
    admissions: "https://admission.kaist.ac.kr/intl-undergraduate/",
  },
];

export const admissionSteps = {
  en: [
    ["Documents", "Gather transcripts and graduation documents. Check which translations or certifications are required."],
    ["Language level", "Check the program’s language of instruction and whether it asks for TOPIK or proof of English proficiency."],
    ["Application", "Submit your application through the university’s official channel. Check its official page for current requirements."],
    ["D-2 student visa", "After admission to a degree program, check the D-2 visa process with the Korean consular office."],
  ],
  ru: [
    ["Документы", "Подготовь выписки с оценками и документы об образовании. Уточни требования к переводу и заверению."],
    ["Уровень языка", "Узнай, на каком языке ведутся занятия и нужно ли подтверждать уровень корейского (TOPIK) или английского."],
    ["Заявление", "Подай заявление через официальный канал университета. Актуальные требования проверь на его сайте."],
    ["Студенческая виза D-2", "После зачисления на программу высшего образования уточни порядок оформления визы D-2 в консульстве Республики Корея."],
  ],
};
