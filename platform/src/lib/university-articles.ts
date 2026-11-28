export const articleSections = [
  ["overview", "Коротко об университете"],
  ["campus", "Где учиться"],
  ["fields", "Сильные направления"],
  ["international", "Для иностранных студентов"],
  ["start", "С чего начать"],
] as const;

export type UniversityPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  filePage: string;
};

type ArticleSection = (typeof articleSections)[number][0];
type Source = { title: string; url: string };
type UniversityArticle = {
  lead: string;
  facts: readonly { label: string; value: string }[];
  sections: Record<ArticleSection, readonly string[]>;
  sources: readonly [Source, Source, ...Source[]];
  photo: UniversityPhoto | null;
};

export const universityArticles: Record<string, UniversityArticle> = {
  snu: {
    lead: "От королевских рукописей до инженерных лабораторий, Seoul National University объединяет на одной площадке в Сеуле занятия, которые обычно связывают с очень разными вузами.",
    facts: [
      { label: "Основан", value: "1946" },
      { label: "Тип", value: "Национальный университет" },
      { label: "Главный кампус", value: "Кванак, Сеул" },
      { label: "Медицинский кампус", value: "Йонгон, Сеул" },
    ],
    sections: {
      overview: [
        "Национальный университет образовали в 1946 году, объединив учебные заведения Сеула. Часть предшественников занималась подготовкой учителей, часть — экономикой и медициной. Фармацевтический колледж вошёл в состав SNU позднее, когда к университету присоединили отдельную школу фармации. История медицинского колледжа восходит к учебному заведению, открытому ещё при Корейской империи.",
      ],
      campus: [
        "Основная площадка Кванак лежит на юге Сеула. Здесь находятся Центральная библиотека с корпусом Кванджон и два разных музея. В университетском музее хранятся исторические коллекции, а здание Музея искусства спроектировал Рем Колхас. Архив Кюджангак хранит письменные памятники Кореи, включая материалы бывшей королевской библиотеки династии Чосон.",
        "Для медицины у SNU есть отдельная площадка. Кампус Йонгон расположен в районе Чонно рядом с улицей Тэханно. По этому адресу находятся медицинский колледж и университетская больница.",
      ],
      fields: [
        "Из естественно-научных подразделений здесь есть College of Natural Sciences и College of Agriculture & Life Sciences. Сельскохозяйственный колледж раньше располагался в Сувоне, а затем переехал в Кванак. Инженерия выделена в отдельный College of Engineering. В перечне также есть College of Human Ecology, колледж изобразительного искусства и музыкальный колледж. При таком устройстве слово «колледж» обозначает часть самого университета, в которой собраны родственные дисциплины.",
      ],
      international: [
        "Международный приём на бакалавриат ведёт Office of Admissions. У центра корейского языка Korean Language Education Center другая задача: в составе Language Education Institute он проводит регулярные курсы, вечернюю программу и отдельные практические занятия. На сайте центра есть раздел с учебными материалами и программа общения с языковым партнёром KLEC Buddy Program. У этих курсов свой порядок подачи, который центр публикует отдельно.",
      ],
      start: [
        "Твоя отправная точка на сайте SNU — Admissions → Undergraduate → Application. На этой странице рядом с руководством по приёму размещены инструкции к онлайн-заявлению и к онлайн-системе рекомендаций. По руководству проверь, как комиссия рассматривает школьные документы из Казахстана и какое подразделение указано для специальности, с которой ты собираешься начать учёбу.",
      ],
    },
    sources: [
      { title: "SNU — международный приём на бакалавриат", url: "https://en.snu.ac.kr/admission/undergraduate/application" },
      { title: "SNU — задачи приёмной комиссии", url: "https://en.snu.ac.kr/about/overview/organization/administrative_organizations" },
      { title: "SNU — центр корейского языка", url: "https://lei.snu.ac.kr/mobile/en/klec/13Week/application.jsp" },
      { title: "Seoul National University — Википедия", url: "https://en.wikipedia.org/wiki/Seoul_National_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/%EA%B0%80%EC%9D%84%EC%9D%98_%EA%B4%80%EC%A0%95%EB%8F%84%EC%84%9C%EA%B4%80.jpeg/1920px-%EA%B0%80%EC%9D%84%EC%9D%98_%EA%B4%80%EC%A0%95%EB%8F%84%EC%84%9C%EA%B4%80.jpeg",
      width: 1920,
      height: 1440,
      alt: "Библиотека Кванджон в кампусе Кванак за деревьями с осенней листвой",
      author: "Tchaikovsky3719",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:%EA%B0%80%EC%9D%84%EC%9D%98_%EA%B4%80%EC%A0%95%EB%8F%84%EC%84%9C%EA%B4%80.jpeg",
    },
  },
  yonsei: {
    lead: "У Yonsei University две заметные точки на карте столичного региона — исторический Синчхон в Сеуле и международная площадка в Сондо.",
    facts: [
      { label: "Истоки", value: "1885" },
      { label: "Современный университет", value: "1957" },
      { label: "Тип", value: "Частный университет" },
      { label: "Кампусы", value: "Сеул, Инчхон, Вонджу" },
    ],
    sections: {
      overview: [
        "В истории Yonsei сошлись медицина и гуманитарное образование. Одной из отправных точек стало учреждение Кванхевон, открытое в 1885 году и позднее получившее название Чеджунвон. Другая линия связана с колледжем, который открывал преподаватель и миссионер Хорас Андервуд. Современный университет появился в 1957 году, когда колледж Йонхи объединился с медицинским колледжем Severance. Оба имени до сих пор встречаются в названиях университетских подразделений и мест на кампусе.",
      ],
      campus: [
        "В сеульском районе Содэмун находится кампус Синчхон. Здесь можно увидеть Underwood Hall, где размещаются административные службы, и главную библиотеку рядом с университетской статуей орла. В Сондо, районе Инчхона, находится Yonsei International Campus. Там действует модель Residential College: учебная жизнь первокурсников связана с общежитиями и их программами. В числе жилых домов есть Avison House и Allen International House. Площадка Mirae находится в Вонджу. В университетском меню она подписана Mirae Campus и вынесена в отдельный раздел.",
      ],
      fields: [
        "В англоязычном Underwood International College (UIC) есть специальности Comparative Literature and Culture, Economics и Life Science and Biotechnology. У Global Leaders College (GLC) свой набор направлений. В него входят International Commerce, Cultural Media и Applied Information Engineering. За пределами этих двух подразделений у Yonsei работают, например, колледж музыки, колледж вычислительных дисциплин и школа бизнеса. Культурные медиа в GLC и сравнительная литература в UIC — примеры того, как интерес к культуре приводит к разным учебным профилям внутри Yonsei.",
      ],
      international: [
        "Korean Language Institute (KLI) ведёт регулярную программу корейского, вечерние занятия и короткие курсы. На официальном сайте также есть отдельные страницы программ, по которым приезжают учиться летом и зимой. Поступление на дипломную программу проходит через приёмные подразделения колледжей. У UIC информация о приёме размещается на его собственной странице, а GLC представлен отдельным блоком на общей странице бакалавриата.",
      ],
      start: [
        "В разделе Apply → Undergraduate начни с блока нужного колледжа. Для UIC переход ведёт на отдельный сайт, а сведения о других программах собраны под Office of Admissions (Colleges) и Global Leaders College. Из этой точки будет проще найти инструкцию для своего маршрута и выяснить, какие школьные документы из Казахстана относятся к нему.",
      ],
    },
    sources: [
      { title: "Yonsei University — международные программы", url: "https://yonsei.ac.kr/en_sc/2245/subview.do" },
      { title: "Yonsei University — поступление на бакалавриат", url: "https://www.yonsei.ac.kr/en_sc/2244/subview.do" },
      { title: "Yonsei University — Википедия", url: "https://en.wikipedia.org/wiki/Yonsei_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Yonsei_University_campus.jpg/1920px-Yonsei_University_campus.jpg",
      width: 1920,
      height: 1080,
      alt: "Каменный корпус с башней и лестницей в кампусе Синчхон",
      author: "Christian Bolz",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Yonsei_University_campus.jpg",
    },
  },
  korea: {
    lead: "У сеульского Korea University каменные корпуса гуманитарной части соседствуют с отдельной научной зоной, где за библиотекой виден зелёный холм.",
    facts: [
      { label: "Основан", value: "1905" },
      { label: "Тип", value: "Частный университет" },
      { label: "Главный кампус", value: "Анам, Сеул" },
      { label: "Другой кампус", value: "Седжон" },
    ],
    sections: {
      overview: [
        "История частного Korea University начинается с колледжа Посон, открытого в 1905 году. Право и экономика рано стали самостоятельными направлениями. После освобождения Кореи учебное заведение получило нынешнее название. Современные международные исследования и журналистика появились в структуре университета намного позднее: соответствующие подразделения открылись в 2001 году. Разные этапы этой истории видны даже в том, какие колледжи размещаются на главной площадке.",
      ],
      campus: [
        "Главный кампус охватывает кварталы Анам и Чонам в сеульском районе Сонбук. Гуманитарная зона узнаваема по каменным зданиям. Над ней выделяется башня корпуса College of Liberal Arts. В научной части рядом с Science Library есть парк на холме, а медицинский комплекс относится к части, которую университет называет Green Campus. В Седжоне есть отдельная площадка со своими колледжами, среди которых College of Global Business и College of Public Policy.",
      ],
      fields: [
        "В Media Hall работает College of Media & Communication. В нижних этажах здания расположен Media Creators Bunker со студиями и помещениями для студенческого вещания. В другой части кампуса здания школы бизнеса сгруппированы вокруг LG-POSCO Hall. В перечень сеульских подразделений, кроме бизнеса и медиа, входят College of Political Science and Economics, College of Informatics и College of Life Sciences and Biotechnology. Состав колледжей различается и между площадками: например, College of Pharmacy указан в перечне подразделений в Седжоне.",
      ],
      international: [
        "У Office of International Affairs есть Global Services Center. Он консультирует иностранцев и участников обмена по вопросам жизни в университете. Другая часть той же страницы отведена контактам Undergraduate International Admission. Оба контакта относятся к офису в Dongwon Global Leadership Hall на сеульском кампусе. Объявления об обмене собраны в отдельном разделе Exchange/Visiting Program, поэтому у приезжающих на обмен и у абитуриентов бакалавриата разные разделы сайта.",
      ],
      start: [
        "На сайте OIA нужный маршрут начинается в меню Undergraduate Admission, пункт Admission Guide. Для вопроса об аттестате из Казахстана используй адрес под заголовком Undergraduate International Admission. Если интересуют медиа или политика, название колледжа в руководстве поможет отличить программу сеульского кампуса от программ в Седжоне.",
      ],
    },
    sources: [
      { title: "Korea University — Global Services Center и контакты приёмной комиссии", url: "https://oia.korea.ac.kr/oia2026/Global-Services-Center.do" },
      { title: "Korea University — Википедия", url: "https://en.wikipedia.org/wiki/Korea_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Korea_University.jpg/1920px-Korea_University.jpg",
      width: 1920,
      height: 1276,
      alt: "Аллея с осенними деревьями перед главным корпусом Korea University",
      author: "Goodbye4ever",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Korea_University.jpg",
    },
  },
  kaist: {
    lead: "Первый курс KAIST даёт время познакомиться с науками и инженерией до выбора кафедры, на которой ты продолжишь бакалавриат.",
    facts: [
      { label: "Истоки", value: "Институт KAIS, 1971" },
      { label: "Тип", value: "Государственный научно-технический институт" },
      { label: "Главный кампус", value: "Тэдок, Тэджон" },
      { label: "Район", value: "Юсон" },
    ],
    sections: {
      overview: [
        "Научно-технический институт был учреждён специальным законом. В 1971 году в Сеуле начал работу его предшественник Korea Advanced Institute of Science, сокращённо KAIS. Первоначально он готовил исследователей на уровне последипломного образования. Наименование KAIST появилось позднее, после объединения KAIS с Korea Institute of Science and Technology. В истории института переезд в Тэджон связан с последующим объединением с Korea Institute of Technology.",
      ],
      campus: [
        "Главный кампус Тэдок находится в районе Юсон города Тэджон. Окружающий его научный кластер Daedeok Innopolis включает исследовательские организации и технологические компании. В самом Тэджоне у института есть также площадка Information Technology Convergence Campus. Название Seoul Campus относится к отдельной площадке, где в том числе размещается College of Business. Основной кампус в Тэджоне и Seoul Campus появились на разных этапах истории института, а ранний KAIS располагался на сеульской площадке Хоннын.",
      ],
      fields: [
        "В College of Natural Sciences входят физика, математика и химия. В инженерной части School of Computing занимается вычислительными дисциплинами, а Department of Aerospace Engineering охватывает аэродинамику, динамику полёта и проектирование аэрокосмических систем. Кафедра Industrial Design связывает проектирование с потребностями людей. Materials Science & Engineering, в свою очередь, изучает свойства материалов и их применение. Эти направления перечислены на англоязычной странице для поступающих, рядом с описаниями других кафедр.",
      ],
      international: [
        "На странице Our Program для иностранных абитуриентов модель выбора направления называется non-declared major system. При зачислении первокурсник получает статус undecided major, кафедру выбирает позднее. На том же сайте Office of Admissions выделяет отдельное меню для подачи заявления и страницу с описаниями учебных направлений. Это два разных этапа: через одну страницу можно разобраться в устройстве бакалавриата, через другую — подготовить заявление.",
      ],
      start: [
        "Просмотри Before You Apply → Our Program, чтобы увидеть, какие кафедры входят в модель со свободным первым курсом. После него переходи к Application Guidelines на том же сайте. Вместе с правилами подачи для выпускника казахстанской школы посмотри образец заявления, который опубликован в меню Application.",
      ],
    },
    sources: [
      { title: "KAIST — хронология института", url: "https://kaist.ac.kr/eng/" },
      { title: "KAIST — учреждение института", url: "https://kaist.ac.kr/en/html/kaist/011701.html" },
      { title: "KAIST — поступление и программы бакалавриата", url: "https://admission.kaist.ac.kr/intl-undergraduate/before/sub01" },
      { title: "KAIST — Википедия", url: "https://en.wikipedia.org/wiki/KAIST" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/KAIST_fountains_view.jpg/1920px-KAIST_fountains_view.jpg",
      width: 1920,
      height: 1440,
      alt: "Пруд с фонтанами и учебные корпуса кампуса KAIST",
      author: "AhmadElq",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:KAIST_fountains_view.jpg",
    },
  },
  postech: {
    lead: "POSTECH вырос в промышленном Пхохане вокруг идеи связать фундаментальную науку с задачами, которые возникают при создании новых материалов и технологий.",
    facts: [
      { label: "Основан", value: "1986" },
      { label: "Тип", value: "Частный университет" },
      { label: "Город", value: "Пхохан" },
      { label: "Регион", value: "Кёнсан-Пукто" },
    ],
    sections: {
      overview: [
        "Частный Pohang University of Science and Technology открылся в 1986 году при участии сталелитейной компании POSCO. С началом работы университета на кампусе разместился исследовательский институт RIST. Позднее университет создал Pohang Accelerator Laboratory. Её установки используют для исследований в физике, химии, материаловедении и науках о жизни. Ускорительная лаборатория помогает понять, почему технический вуз в городе, связанном с металлургией, развивает также фундаментальные дисциплины.",
      ],
      campus: [
        "Кампус расположен в стороне от центра Пхохана. На официальной карте отдельно обозначены Tae-Joon Park Digital Library, POSCO International Center и National Institute for Nanomaterials Technology. Библиотека названа в честь основателя университета Пак Тхэджуна. Корпус на фотографии относится к Graduate Institute of Ferrous & Eco Materials Technology, который также выделен на карте. Площадка объединяет места для занятий и крупные исследовательские объекты: они относятся к разным подразделениям и подписаны по-разному.",
      ],
      fields: [
        "Физика, химия и науки о жизни существуют в POSTECH как самостоятельные академические направления. Кафедра Life Sciences появилась вскоре после открытия университета. Позднее к техническим подразделениям добавилась Creative IT Engineering. Отдельное внимание к материалам заметно по исследовательским центрам: наноматериалами занимается профильный институт, а металлургией — институт для последипломного образования. Для выпускника школы это описывает общую научную среду кампуса, в которой начинается обучение по бакалаврской программе.",
      ],
      international: [
        "У иностранных абитуриентов есть сайт POSTECH International Undergraduate. В нём выделены International Admissions Guidelines и International Student Support. Приёмная комиссия опубликовала раздел вопросов о различных школьных системах, включая системы, где продолжительность школьного образования отличается от корейской. Кандидаты, у которых уже есть опыт учёбы в другом вузе, также проходят процедуру поступления на первый курс; отдельный перевод комиссия в этом маршруте не предусматривает.",
      ],
      start: [
        "В International Admissions Guidelines есть переход View FAQ, который ведёт к вопросам о разных школьных системах. Если ты заканчиваешь одиннадцатилетнюю школу в Казахстане, начни с вопроса о такой программе и прочитай ответ вместе с руководством POSTECH для поступающих на первый курс.",
      ],
    },
    sources: [
      { title: "POSTECH — приём на первый курс", url: "https://adm-iu.postech.ac.kr/user/comm/menu/3317587a17a23d4dacdb9ffc4762bf4a/content/index.do" },
      { title: "POSTECH — карта кампуса", url: "https://www.postech.ac.kr/eng/about/campus_map.do" },
      { title: "Pohang University of Science and Technology — Википедия", url: "https://en.wikipedia.org/wiki/Pohang_University_of_Science_and_Technology" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/GIFT_POSTECH_New_Building.jpg/1920px-GIFT_POSTECH_New_Building.jpg",
      width: 1920,
      height: 981,
      alt: "Корпус института чёрной металлургии POSTECH со стеклянными переходами",
      author: "Graduate Institute of Ferrous Technology",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:GIFT_POSTECH_New_Building.jpg",
    },
  },
  unist: {
    lead: "Из окон кампуса UNIST видны холмы у Оньяна, а история самого института тесно связана с промышленным Ульсаном.",
    facts: [
      { label: "Основан", value: "2007" },
      { label: "Тип", value: "Научно-технический институт с госфинансированием" },
      { label: "Город", value: "Ульсан" },
      { label: "Кампус", value: "Оньян, Ульджу" },
    ],
    sections: {
      overview: [
        "UNIST учреждён в 2007 году, первые занятия бакалавриата начались в 2009-м. Институт создавали в городе, где сосредоточены автомобильные предприятия, верфи и нефтехимическое производство. В 2015 году он получил новый статус по специальному закону и стал научно-техническим исследовательским институтом с государственным финансированием. Первые наборы и преобразование — разные события в истории UNIST, поэтому в материалах об институте встречаются обе даты.",
      ],
      campus: [
        "Адрес основной площадки — Оньян, уезд Ульджу в составе города Ульсана. На площадке рядом с аудиториями и лабораториями стоят университетские общежития. Его окружает холмистая местность, а в центре находится искусственный пруд Камакмот. В университете есть отдельные здания библиотеки и школы делового управления. Ульсанский центр взаимодействия промышленности и университетов появился позднее как вторая площадка института.",
      ],
      fields: [
        "Направления бакалавриата включают Department of Mechanical Engineering, Department of Materials Science and Engineering и School of Energy and Chemical Engineering. За математические и вычислительные дисциплины отвечают отдельные кафедры. School of Liberal Arts ведёт общеобразовательную часть первого курса. Исследовательская работа института видна по тематике его центров: один из центров Institute for Basic Science при UNIST занимается многомерными углеродными материалами, другой — мягкой и живой материей. В 2017 году появился Industry-Academia Battery R&D Center, созданный для работы над аккумуляторными технологиями вместе с промышленными партнёрами.",
      ],
      international: [
        "В англоязычной приёмной части сайта выделен раздел Fall Undergraduate Admissions для поступления на первый курс. Здесь рядом с руководством для иностранных абитуриентов размещают форму заявления и отдельный файл Personal Statement and Study Plan questions. Есть и специальный раздел GKS (Embassy Track). Страница руководства ведёт к собственному контакту приёмной комиссии UNIST в Ульсане.",
      ],
      start: [
        "Пара документов, с которой удобно начать на сайте UNIST, находится в разделе Fall Undergraduate Admissions. Открой руководство для иностранных абитуриентов вместе с файлом Personal Statement and Study Plan questions. По инструкции проверь, как представить казахстанское школьное образование, а по вопросам поймёшь, о чём именно институт просит рассказать в учебном плане.",
      ],
    },
    sources: [
      { title: "UNIST — переход к статусу научно-технического института", url: "https://www.unist.ac.kr/unist/center/news-en.do?article.offset=837&articleLimit=9&articleNo=237340&mode=view" },
      { title: "UNIST — адрес кампуса в Оньяне", url: "https://www.unist.ac.kr/unist/introduction/location.do" },
      { title: "UNIST — поступление на бакалавриат", url: "https://adm-u.unist.ac.kr/admission-eng/admissions/admissions.do" },
      { title: "Ulsan National Institute of Science and Technology — Википедия", url: "https://en.wikipedia.org/wiki/Ulsan_National_Institute_of_Science_and_Technology" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/UNIST_campus_2015.jpg/1920px-UNIST_campus_2015.jpg",
      width: 1920,
      height: 1280,
      alt: "Аллея между корпусами UNIST на фоне лесистых холмов",
      author: "Jongbhak",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:UNIST_campus_2015.jpg",
    },
  },
  skku: {
    lead: "У Sungkyunkwan University гуманитарный кампус вырос рядом с исторической конфуцианской академией, а естественно-научный сложился отдельно, в Сувоне.",
    facts: [
      { label: "Тип", value: "Частный университет" },
      { label: "Гуманитарный кампус", value: "Сеул" },
      { label: "Естественно-научный кампус", value: "Сувон" },
    ],
    sections: {
      overview: [
        "Частный университет связывает свою историю с учебным заведением династии Чосон. На его территории сохранился исторический комплекс, а современное подразделение College of Confucian Studies and Eastern Philosophy продолжает преподавать восточную философию. В официальной истории факультетов отдельно упоминается создание современного College of Liberal Arts. В сеульском перечне за базовую подготовку первокурсников отвечает University College.",
      ],
      campus: [
        "Кампус Humanities and Social Sciences расположен на холме в центре Сеула, недалеко от станции Хехва и улицы Тэханно. По соседству находятся бывшие королевские дворцы Чхандоккун и Чхангёнгун. Павильон Пичхондан стоит рядом с современным залом шестисотлетия. Естественно-научный кампус находится в Сувоне, в квартале Юльчон. Его территория устроена иначе: там есть ботанический сад и спортивные площадки, а ближайшая станция носит название университета.",
      ],
      fields: [
        "В Сеуле свои учебные подразделения у экономики, бизнеса, общественных наук и конфуцианских исследований. Среди бакалаврских программ школы бизнеса выделяется Global Business Administration. В Сувоне сосредоточены естественные науки, инженерия, спортивные дисциплины и медицина. На естественно-научной площадке работает SKKU Learning Factory. Это мастерская, где идеи превращают в прототипы. Для этого в ней предусмотрены лазерные резаки, трёхмерные принтеры и оборудование для работы с управляющей электроникой Arduino.",
      ],
      international: [
        "Office of International Student Services работает с иностранными учащимися и публикует свои контакты в разделе Office of International Affairs. Изучением корейского занимается Sungkyun Language Institute, у которого в университетском меню отдельная страница. Приём на бакалавриат описан в разделе Undergraduate англоязычного сайта приёма SKKU. Из-за такого деления объявления для абитуриентов, консультации для уже зачисленных и описание языковых курсов находятся в разных разделах.",
      ],
      start: [
        "На первой странице англоязычного сайта приёма SKKU выбери вкладку Undergraduate. За полным названием направления можно обратиться к списку Humanities and Social Sciences Campus на сайте университета. С этими страницами под рукой проверь, на какой кампус и в какую группу приёма относится твоя специальность, прежде чем заполнять заявление.",
      ],
    },
    sources: [
      { title: "Sungkyunkwan University — колледжи сеульского кампуса", url: "https://eng.skku.edu/eng/edu/education01.do" },
      { title: "Sungkyunkwan University — международные службы", url: "https://eng.skku.edu/eng/International/AboutDivision/AbouttheInternationalAffairsDivision04.do" },
      { title: "Sungkyunkwan University — международный приём", url: "https://admission-global.skku.edu/eng/" },
      { title: "Sungkyunkwan University — Википедия", url: "https://en.wikipedia.org/wiki/Sungkyunkwan_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Sungkyunkwan_University_Bicheondang_and_600th_Anniversary_Hall.jpg/1920px-Sungkyunkwan_University_Bicheondang_and_600th_Anniversary_Hall.jpg",
      width: 1920,
      height: 1280,
      alt: "Павильон Пичхондан перед современным корпусом в сеульском кампусе Sungkyunkwan",
      author: "S h y numis",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Sungkyunkwan_University_Bicheondang_and_600th_Anniversary_Hall.jpg",
    },
  },
  hanyang: {
    lead: "Инженерное образование в Hanyang University развивалось из одной школы, а сегодня технические направления распределены между Сеулом и кампусом ERICA в Ансане.",
    facts: [
      { label: "Истоки", value: "Инженерная школа, 1939" },
      { label: "Тип", value: "Частный университет" },
      { label: "Сеульский кампус", value: "Сондон, Сеул" },
      { label: "Кампус ERICA", value: "Ансан" },
    ],
    sections: {
      overview: [
        "В 1939 году будущий Hanyang начал работу как Dong-A Engineering Institute. Во время Корейской войны занятия временно продолжались в Пусане. В этот период при колледже открыли центр подготовки преподавателей естественно-научных и технических дисциплин для школ. В 1953 году Hanyang получил разрешение открыть подразделение последипломного образования. Сегодня Hanyang — частный университет. В его названии сохранилось одно из прежних названий Сеула эпохи Чосон.",
      ],
      campus: [
        "На сеульской площадке в районе Сондон работает библиотека Infonopia Hanyang. Административный корпус на сеульской площадке открыли в год юбилея Hanyang, в 2009-м. ERICA находится в другом городе, Ансане. Аббревиатура означает Education Research Industry Cluster at Ansan. В его планировке заметны открытые пространства: на территории находятся парк у озера и экологический парк. На участке кампуса действует проект Campus Innovation Park, связанный с размещением технологических компаний и исследовательской инфраструктуры.",
      ],
      fields: [
        "В Сеуле можно изучать Engineering, Architecture, Computer Science или Automotive Engineering. На площадке ERICA список бакалавриата устроен иначе: там представлены Engineering Sciences, Science & Convergence Technology, Computing и Design. В перечень ERICA входят также фармация и коммуникации. У двух кампусов есть общие области, например вычислительные дисциплины, но названия подразделений и соседние программы отражают разные учебные среды.",
      ],
      international: [
        "У сеульского Office of International Affairs есть направление International Admissions & Student Services и отдельный пункт Korean Language Program. Международный офис ERICA публикует собственные контакты для International Undergraduate Student Admissions. Кроме приёма, в Ансане выделены International Student Services и консультации для иностранных учащихся. Такое устройство важно в переписке: у одного университета есть отдельные адресаты по вопросам бакалавриата в двух городах.",
      ],
      start: [
        "Для Сеула начни с Major Guidebook for international Students в меню Admissions международного отдела. Если тебя привлекает дизайн или другая специальность в Ансане, ориентиром будет страница International Admissions офиса ERICA. По этим разделам проверь, кто принимает заявление с казахстанским аттестатом и как выбранное направление называется в материалах нужного кампуса.",
      ],
    },
    sources: [
      { title: "Hanyang University — международный отдел в Сеуле", url: "https://oia.hanyang.ac.kr/" },
      { title: "Hanyang University — международный отдел ERICA", url: "https://global.hanyang.ac.kr/eng/s1/s1_3.php" },
      { title: "Hanyang University — Википедия", url: "https://en.wikipedia.org/wiki/Hanyang_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hanyang_University_008.JPG/1920px-Hanyang_University_008.JPG",
      width: 1920,
      height: 1440,
      alt: "Каменный корпус Hanyang University и площадь перед ним в Сеуле",
      author: "Piotrus",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Hanyang_University_008.JPG",
    },
  },
  sogang: {
    lead: "За входом в Sogang University стоит башня, силуэт которой образуют первые две согласные корейского названия университета.",
    facts: [
      { label: "Основан", value: "1960" },
      { label: "Тип", value: "Частный университет" },
      { label: "Город", value: "Сеул" },
      { label: "Район кампуса", value: "Мапхо" },
    ],
    sections: {
      overview: [
        "Sogang — частный университет, основанный Обществом Иисуса в 1960 году. Имена из истории ордена сохранились в названиях корпусов: библиотека названа в честь Игнатия Лойолы, а Gonzaga Hall — в честь Алоизия Гонзаги. Это соседствует с более поздними учебными подразделениями: профиль медиа, искусства и науки оформился в отдельную школу уже в современной истории Sogang.",
      ],
      campus: [
        "Кампус расположен в районе Мапхо, в сеульском Синчхоне, где сосредоточены и другие университеты. Библиотека Лойолы находится на холме. Рядом с главным входом стоит Albatross Tower, в форме которой использованы знаки ㅅ и ㄱ. Ещё одна характерная для кампуса деталь — Gonzaga Plaza под зданием Gonzaga Hall. Названия таких мест и учебных корпусов часто встречаются в англоязычных адресах университета.",
      ],
      fields: [
        "В Sogang Business School есть Business Administration, а в College of Economics — Economics. В перечне медийных направлений есть Journalism and Strategic Communication, Media & Entertainment и Art & Technology. У Loyola International College представлены Global Korean Studies и Geppert School of International Studies. Технические направления включают Department of Electronic Engineering, компьютерную инженерию и разработку полупроводниковых систем. У кафедры электронной инженерии есть свой англоязычный сайт, где отдельно представлены учебная программа, исследования и раздел Admissions с контактом для иностранных поступающих.",
      ],
      international: [
        "Центр Sogang Korean Language Education Center работает с 1990 года. Он предлагает регулярные и вечерние занятия корейским, онлайн-курсы и специальные летние курсы. У поступающих на бакалавриат есть отдельный контакт International Admission при Office of International Affairs. Англоязычная страница кафедры электронной инженерии указывает адрес этого отдела в Berchmans Woojung Hall и публикует рядом ссылку на руководство для абитуриентов.",
      ],
      start: [
        "Если интересует электронная инженерия, на её сайте выбери Admissions → Undergraduate и открой Admission Guideline. Там же дан адрес International Admission для вопросов с казахстанским аттестатом. В письме укажи Department of Electronic Engineering: контакт общий для поступления, а учебный план и сведения о кафедре размещены на её собственном сайте.",
      ],
    },
    sources: [
      { title: "Sogang University — бакалавриат по электронной инженерии", url: "https://ee.sogang.ac.kr/eng/recruit/ug_info.php" },
      { title: "Sogang University — Википедия", url: "https://en.wikipedia.org/wiki/Sogang_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/2006%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%9005.jpg/1280px-2006%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%9005.jpg",
      width: 1280,
      height: 960,
      alt: "Газон и учебный корпус в кампусе Sogang University",
      author: "최광모",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:2006%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%9005.jpg",
    },
  },
  ewha: {
    lead: "В Ewha Womans University история женского образования соседствует с современной архитектурой: от гранитных корпусов Синчхона до заглублённого комплекса ECC.",
    facts: [
      { label: "Истоки", value: "Школа Ewha Haktang, 1886" },
      { label: "Тип", value: "Частный женский университет" },
      { label: "Город", value: "Сеул" },
      { label: "Район кампуса", value: "Содэмун" },
    ],
    sections: {
      overview: [
        "Ewha начиналась со школы для девочек Ewha Haktang, которую Мэри Скрэнтон открыла в 1886 году. Сегодня это частный женский университет. В университетском архиве историю школы напоминает здание, спроектированное как копия традиционного дома, в котором она начинала работу. Само название Ewha означает «цветок груши». Написание Womans — часть официального английского названия учреждения.",
      ],
      campus: [
        "В 1935 году Ewha переехала в Синчхон, в район Содэмун в Сеуле. Первым зданием нового кампуса стал Pfeiffer Hall. За ним появились Case Hall и Emerson Chapel. После Корейской войны на площадке построили Helen Hall, первую библиотеку этого кампуса. В 2008 году завершили строительство Ewha Campus Complex. Его широкая лестница и проход между стенами комплекса видны на фотографии. Университет описывает его как место, где соединяются учебные и культурные пространства.",
      ],
      fields: [
        "В структуре бакалавриата есть College of Art & Design, College of Music и College of Artificial Intelligence. По университетскому списку можно найти Division of Communication & Media. Рядом с профильными колледжами в каталоге стоит HOKMA College of General Education, отвечающий за общеобразовательную часть. Среди направлений College of Art & Design указаны керамика, скульптура и визуальные коммуникации, а в College of Music есть композиция и корейская музыка.",
      ],
      international: [
        "International Student Affairs Team публикует инструкции для иностранных абитуриенток. В них описан Global Scholars Program в составе HOKMA, где изучают корейский и общеобразовательные дисциплины. Для Division of International Studies и College of Nursing в руководстве выделены исключения из этого маршрута. У Ewha Language Center своя история: корейский как иностранный там преподают с 1988 года. Его курсы и документация приёмной команды размещены на разных сайтах.",
      ],
      start: [
        "На сайте International Student Affairs Team найди Admissions → Admissions Guide и англоязычную версию руководства. Для искусства и дизайна в нём выделены дополнительные материалы. Если рассматриваешь эти специальности, начни с их описания в руководстве: там можно сверить, какие работы нужно подготовить вместе со школьными документами из Казахстана.",
      ],
    },
    sources: [
      { title: "Ewha — история кампуса", url: "https://www.ewha.ac.kr/ewhaen/intro/history-campus.do" },
      { title: "Ewha — приём иностранных абитуриенток", url: "https://isa.ewha.ac.kr/oisa/1442/subview.do" },
      { title: "Ewha — программы бакалавриата", url: "https://www.ewha.ac.kr/ewhaen/academics/college.do" },
      { title: "Ewha — языковой центр", url: "https://elc.ewha.ac.kr/elc_en/intro/intro.do" },
      { title: "Ewha Womans University — Википедия", url: "https://en.wikipedia.org/wiki/Ewha_Womans_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ewha_Campus_Complex.jpg/1920px-Ewha_Campus_Complex.jpg",
      width: 1920,
      height: 1082,
      alt: "Широкая лестница и проход между корпусами Ewha Campus Complex",
      author: "Ken Eckert",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Ewha_Campus_Complex.jpg",
    },
  },
  kyunghee: {
    lead: "В Kyung Hee University гостиничное дело и корейская медицина относятся к сеульской площадке, а международные исследования и инженерия представлены в Йонъине.",
    facts: [
      { label: "Тип", value: "Частный университет" },
      { label: "Кампус Seoul", value: "Тондэмун, Сеул" },
      { label: "Кампус Global", value: "Йонъин" },
    ],
    sections: {
      overview: [
        "Kyung Hee — частный университет с несколькими площадками и очень разными колледжами. Одна из заметных особенностей его структуры — отдельный College of Korean Medicine. Его предшественником был Dongyang College, который затем реорганизовали в колледж корейской медицины. Рядом с корейской медициной в перечне есть обычная медицина, стоматология и фармация. Колледж корейской медицины сосредоточен на традиционных медицинских дисциплинах; в историческом описании университета с ним связано и подразделение International Studies of Korean Medicine.",
      ],
      campus: [
        "Сеульский кампус находится в районе Тондэмун. Там стоят здание администрации с колоннадой и Центральная библиотека с музеем. Университетский адрес Global Campus относится к району Кихын города Йонъин, рядом с Сувоном. На его карте обозначены ворота Neo-Renaissance Gate, парк Renaissance Park, теплицы и учебная ферма. Есть и третья площадка Gwangneung Campus в Намъянджу. Официальная карта показывает каждую из этих территорий отдельно.",
      ],
      fields: [
        "Сеульский College of Hotel and Tourism Management занимается гостиничным делом и туризмом, а рядом в перечне факультетов находится College of Management. На кампусе Global размещаются College of International Studies, College of Foreign Languages and Literature, технические подразделения и College of Art & Design. География направлений заметна и на карте: у Global Campus отдельно подписаны корпуса инженерии, наук о жизни и кафедра керамики. Это объясняет, почему два интересующих тебя направления одного университета могут оказаться в разных городах.",
      ],
      international: [
        "На сайте Kyung Hee есть раздел Undergraduate Admission для иностранных абитуриентов с руководством и перечнем направлений. Для вопросов о бакалавриате на странице указаны контакты отделов Seoul Campus и Global Campus. В меню также отделены материалы для поступающих в магистратуру и дальнейших программ, поэтому собственная вкладка бакалавриата важна для выпускника школы.",
      ],
      start: [
        "На странице международного приёма Kyung Hee начни с Undergraduate Admission → Admission Unit, чтобы найти программу и её площадку. За описанием документов для казахстанской школы переходи в соседний пункт Admission Guideline. Название кампуса из Admission Unit пригодится, если нужно будет написать в один из двух отделов.",
      ],
    },
    sources: [
      { title: "Kyung Hee University — карта и адреса кампусов", url: "https://news.khu.ac.kr/eng/user/contents/view.do?menuNo=300050" },
      { title: "Kyung Hee University — отдел международного приёма", url: "https://iadmission.khu.ac.kr/gglobalcenter/user/main/view.do" },
      { title: "Kyung Hee University — Википедия", url: "https://en.wikipedia.org/wiki/Kyung_Hee_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kyung_Hee_Univ._Administration_Building%28Seoul_Campus%29.JPG/1920px-Kyung_Hee_Univ._Administration_Building%28Seoul_Campus%29.JPG",
      width: 1920,
      height: 1440,
      alt: "Здание администрации Kyung Hee с колоннами и фонтаном в Сеуле",
      author: "Kys951",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Kyung_Hee_Univ._Administration_Building(Seoul_Campus).JPG",
    },
  },
  chungang: {
    lead: "В Chung-Ang University театральные и кинематографические дисциплины соседствуют с фотостудиями, а у кампуса в Ансоне есть сцена под открытым небом.",
    facts: [
      { label: "Тип", value: "Частный университет" },
      { label: "Главный кампус", value: "Тонджак, Сеул" },
      { label: "Другой кампус", value: "Ансон, Кёнгидо" },
    ],
    sections: {
      overview: [
        "Истоки частного университета связаны с детским садом и школой подготовки воспитательниц. Когда учебное заведение перебралось в Хыксок, одним из первых каменных зданий стал Young-Shin Hall. Он по-прежнему стоит возле главного входа в сеульский кампус. Сегодня профиль Chung-Ang гораздо шире педагогики: среди подразделений университета есть творческие факультеты, естественные науки, инженерия и фармация.",
      ],
      campus: [
        "Сеульская площадка находится в районе Тонджак. Центральная библиотека и Seorabol Hall выходят к площади Emancipation Square, а в College of Pharmacy работают лаборатории в Pfeiffer Hall. На другой площадке, в Ансоне провинции Кёнгидо, учебные помещения колледжа искусств включают мастерские и театр. Неподалёку от музыкальных корпусов находится Lakeside Theatre, сцена у воды, которую используют для выступлений на открытом воздухе. В Ансоне также есть отдельный комплекс College of Biotechnology & Natural Resources.",
      ],
      fields: [
        "Здесь можно различить несколько подходов к работе над постановкой. Department of Theatre отвечает за театр, Department of Film Studies — за кино, а Department of Theatre and Film Design занимается оформлением театральных и кинопроектов. В описании последнего упоминается сотрудничество с театральной и кинематографической кафедрами. На сеульском кампусе есть Art Center, где проходят университетские выступления, а в ансонском перечне направлений представлены фотография, скульптура и танец. В программе Theatre and Film Design в качестве областей работы перечислены сценография, свет и оформление выставочного пространства.",
      ],
      international: [
        "У международного отдела OIA действует раздел 학부입학 для поступления на бакалавриат. В нём отдельно находятся порядок поступления, объявления, руководство и описания направлений. В текущих материалах этого отдела встречается название 순수외국인전형, обозначающее отдельный маршрут приёма иностранных кандидатов. Информация о каждом наборе публикуется на сайте отдела.",
      ],
      start: [
        "До сбора работ для творческой программы загляни в 학부입학 → 모집요강 на сайте международного отдела. В руководстве нужно найти название, совпадающее со страницей College of Arts, и проверить материалы, которые требуют у абитуриента с казахстанским аттестатом. Учебные описания театральных кафедр помогут понять, к какой специальности относится выбранное тобой название.",
      ],
    },
    sources: [
      { title: "Chung-Ang University — колледж искусств", url: "https://arts.cau.ac.kr/user-datas/en/u_1.asp" },
      { title: "Chung-Ang University — международный отдел", url: "https://oias.cau.ac.kr/cauoie/index.do" },
      { title: "Chung-Ang University — Википедия", url: "https://en.wikipedia.org/wiki/Chung-Ang_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Chungang_university_garden_view.jpg/1920px-Chungang_university_garden_view.jpg",
      width: 1920,
      height: 1118,
      alt: "Цветники перед корпусами Chung-Ang University",
      author: "Raccoon Dog",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Chungang_university_garden_view.jpg",
    },
  },
  dongguk: {
    lead: "В Dongguk University можно выйти с кампуса к тропам Намсана, а в учебном плане по кино пройти путь от истории корейского фильма до собственной работы.",
    facts: [
      { label: "Истоки", value: "Школа Мёнджин, 1906" },
      { label: "Тип", value: "Частный университет" },
      { label: "Основной кампус", value: "Чунгу, Сеул" },
    ],
    sections: {
      overview: [
        "История Dongguk началась в 1906 году со школы Мёнджин, которую основали деятели буддийского образования. Современный Dongguk — частный университет, связанный с буддийской традицией. На территории сохранилось имя школы в названии Myeongjin Hall, одного из исторических корпусов. Рядом с этой частью университетской истории развивалось образование в области театра и кино. Сегодня эти направления входят в College of Arts.",
      ],
      campus: [
        "Сеульская площадка расположена в районе Чунгу, с северной стороны Намсана. Верхние корпуса примыкают к дорожкам парка. На территории кампуса находится буддийский храм Чонгаквон. С университетом связан и Chungmuro Visual Arts Center, площадка для работы с кино и визуальными медиа. Эти места показывают разные стороны Dongguk: буддийское наследие можно увидеть в самом кампусе, а кинопроизводство связано ещё и с инфраструктурой Чхунмуро.",
      ],
      fields: [
        "У Film & Digital Media в программе есть History of Korean Film, Editing и Film Production Workshop. В начале обучения разбирают теорию и основы съёмки. Позднее в перечне появляются практика написания сценария, монтаж и разбор документального кино. В более продвинутой части студенты используют эти навыки в итоговых проектах. Театральное направление описано отдельно, а в том же колледже есть программа Korean Music. Один и тот же факультет охватывает работу со сценой, экраном и музыкальными традициями.",
      ],
      international: [
        "Office of International Students занимается приёмом иностранцев на программы разных уровней и сопровождает зачисленных по учебным вопросам. В таблице сотрудников указано, кто отвечает за приём иностранцев на бакалавриат. В меню International Student Life есть Korean Language Program. Объявления для поступающих размещаются в разделе 유학생공지. На странице офиса для языковых курсов приводится отдельный контакт, рядом с адресами для поступающих и для учащихся.",
      ],
      start: [
        "У Film & Digital Media список курсов открыт в Academics → Colleges → College of Arts. За условиями набора обратись к объявлению 학부 외국인 입학 안내 (모집요강) в ленте 유학생공지. К нему приложено руководство для иностранных абитуриентов, по которому можно проверить доступность направления и список документов.",
      ],
    },
    sources: [
      { title: "Dongguk University — программы колледжа искусств", url: "https://www.dongguk.edu/eng/dandae/381" },
      { title: "Dongguk University — международный отдел", url: "https://en.dongguk.edu/eng/page/1525" },
      { title: "Dongguk University — объявление о международном приёме", url: "https://en.dongguk.edu/article/INTSTUNOTICE/detail/26766179" },
      { title: "Dongguk University — Википедия", url: "https://en.wikipedia.org/wiki/Dongguk_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/DONGGUK_UNIVERSITY_Library.jpg/1280px-DONGGUK_UNIVERSITY_Library.jpg",
      width: 1280,
      height: 851,
      alt: "Вход в библиотеку Dongguk University под выступающим стеклянным фасадом",
      author: "DONGGUK UNIVERSITY",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:DONGGUK_UNIVERSITY_Library.jpg",
    },
  },
  hongik: {
    lead: "У входа в Hongik University городской поток Хондэ проходит под корпусом Хонмун, а дальше начинаются учебные площадки художников, дизайнеров и инженеров.",
    facts: [
      { label: "Основан", value: "1946" },
      { label: "Тип", value: "Частный университет" },
      { label: "Главный кампус", value: "Мапхо, Сеул" },
      { label: "Другой кампус", value: "Седжон" },
    ],
    sections: {
      overview: [
        "История частного Hongik начинается в 1946 году со школы Hongmoon Daehakgwan. В дальнейшем заведение закрепилось в районе Мапхо. Корейское сокращение Hongdae со временем стало обозначать и университет, и прилегающий городской квартал. Поэтому название в путеводителе по Сеулу может относиться к окружающему району, тогда как в материалах приёмной комиссии важны полное название Hongik University и обозначение кампуса.",
      ],
      campus: [
        "Сеульская площадка отмечена на карте корпусом Hongmun Hall у входа. Среди учебных зданий обозначены Design & Arts Hall и корпуса архитектуры и инженерии. На другой площадке, в Седжоне, появились собственные учебные помещения и отдельный перечень программ. В университетских материалах встречается также Art&Design Valley. Внутри Hongik важно само различие между учебным зданием и площадкой в другом городе: даже на карте сеульских зданий есть Sejong Hall, название которого звучит как название города.",
      ],
      fields: [
        "В сеульском College of Fine Arts рядом существуют Painting, Printmaking, Sculpture и Ceramics and Glass. Есть Woodworking and Furniture Design, а программа Design включает Visual Communication Design и Industrial Design. В Седжоне бакалавриат Design and Media объединяет свои профили, в том числе Product Design, Digital Media Design и Animation. Для архитектуры и градостроительства в Сеуле предусмотрен отдельный колледж. Эти названия отражают работу с разными материалами и задачами — от печатной графики до проектирования пространств.",
      ],
      international: [
        "Admissions Office ведёт страницу Admissions Guide for International Students с таблицей Undergraduate Programs, разбитой по кампусам. На университетской карте также отмечен Korean Language Education Center. Руководство международного приёма и языковой центр отвечают за разные части университетской жизни: в первом публикуют перечень направлений для иностранцев, на карте находится адрес языкового подразделения.",
      ],
      start: [
        "Ищи свою специальность в таблице Undergraduate Programs на странице Admissions Guide for International Students. У строк Seoul и Sejong разные перечни дизайна. Когда найдёшь нужный профиль, сверь с руководством порядок подачи, состав школьных документов из Казахстана и дополнительные материалы, если они предусмотрены для творческого направления.",
      ],
    },
    sources: [
      { title: "Hongik University — карта сеульского кампуса", url: "https://art.hongik.ac.kr/en/about/seoul-campus-map.do" },
      { title: "Hongik University — международный приём на бакалавриат", url: "https://my.hongik.ac.kr/en/admissions/admissions-guide.do" },
      { title: "Hongik University — Википедия", url: "https://en.wikipedia.org/wiki/Hongik_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Hongik_University_Gate.jpg/1920px-Hongik_University_Gate.jpg",
      width: 1920,
      height: 1285,
      alt: "Вход в кампус Hongik University под корпусом Хонмун",
      author: "Adbar",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Hongik_University_Gate.jpg",
    },
  },
  hufs: {
    lead: "На кампусе Hankuk University of Foreign Studies в Йонъине казахский и узбекский входят в круг языков, которыми занимаются вместе с изучением Центральной Азии.",
    facts: [
      { label: "Основан", value: "1954" },
      { label: "Тип", value: "Частный университет" },
      { label: "Сеульский кампус", value: "Имун, Сеул" },
      { label: "Кампус Global", value: "Йонъин" },
    ],
    sections: {
      overview: [
        "HUFS основали в 1954 году как колледж иностранных языков. На первых курсах преподавали в том числе английский, китайский, французский и русский. По мере развития сочетание языка и знаний о регионе стало отдельным направлением: сейчас в университете есть College of International and Area Studies и кафедры, посвящённые отдельным странам. Также HUFS развивает собственную систему языковых экзаменов FLEX через профильный центр.",
      ],
      campus: [
        "Сеульская площадка находится в квартале Имун района Тондэмун. Здесь сосредоточены основные языковые и общественно-научные подразделения. Другая площадка, Global Campus, находится в районе Чхоин города Йонъин. У неё отдельный адрес и академические подразделения: например, College of Interpretation and Translation и College of Central and East European Studies. Разные кампусы в данном случае означают разные наборы языков и разные подходы к их изучению.",
      ],
      fields: [
        "В Сеуле College of English включает English Linguistics and Language Technology и English for International Conferences and Communication. На площадке Global можно изучать письменный и устный перевод с немецкого, испанского, китайского и других языков. Department of Central Asian Studies входит в College of International and Area Studies. Для выпускника из Казахстана это направление может быть интересно как возможность увидеть знакомый регион в отдельной программе. В том же колледже представлены, например, Department of Brazilian Studies и Department of Indian Studies.",
      ],
      international: [
        "На сайте Office of International Admission & Management выделены Undergraduate Course Team и International Student Support. В общем меню есть Center for Korean Language and Culture. Отдельная вкладка Exchange Student ведёт к материалам о программах обмена. Для приезжающих по обмену в этом меню предусмотрены Pre-Arrival Guide и Student Guidebook.",
      ],
      start: [
        "Точный пункт для первого шага — Undergraduate Admission → Admission Guide на сайте Office of International Admission & Management. В списке специальностей проверь одновременно название кафедры и кампус. Для вопросов о школьных документах обратись к Undergraduate Course Team: его контакты приведены там же в разделе для абитуриентов.",
      ],
    },
    sources: [
      { title: "HUFS — международная приёмная комиссия", url: "https://international.hufs.ac.kr/" },
      { title: "Hankuk University of Foreign Studies — Википедия", url: "https://en.wikipedia.org/wiki/Hankuk_University_of_Foreign_Studies" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hankuk_University_of_Foreign_Studies_Seoul_campus_20180914_090938.jpg/1920px-Hankuk_University_of_Foreign_Studies_Seoul_campus_20180914_090938.jpg",
      width: 1920,
      height: 1080,
      alt: "Многоэтажный корпус с колоннами в сеульском кампусе HUFS",
      author: "LERK",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Hankuk_University_of_Foreign_Studies_Seoul_campus_20180914_090938.jpg",
    },
  },
  konkuk: {
    lead: "У сеульского Konkuk University ветеринарный колледж, художественные направления и библиотека находятся на кампусе вокруг озера Ильгам.",
    facts: [
      { label: "Тип", value: "Частный университет" },
      { label: "Основной кампус", value: "Сеул" },
      { label: "Кампус GLOCAL", value: "Чхунджу" },
    ],
    sections: {
      overview: [
        "Konkuk вырос из школы политических наук Chosun School of Politics. В 1959 году учебное заведение получило нынешнее университетское название. Среди людей, связанных с его историей, выделяется врач Ю Сокчхан, известный под именем Sanghuh. Это имя носят университетская библиотека и один из колледжей. Историю самой школы можно увидеть в бывшем учебном здании Sanghuh Memorial Hall, куда впоследствии переехал университетский музей.",
      ],
      campus: [
        "Озеро Ильгам занимает центральную часть сеульской площадки. Его сделали на месте заболоченного участка после переезда университета. В прошлом водоём использовали зимой для соревнований на коньках. Сегодня вокруг него видны учебные корпуса и городская застройка. Рядом с территорией работает станция метро Konkuk University. На площадке в Чхунджу, которую университет называет GLOCAL Campus, есть собственные колледжи и другой перечень направлений. В Сеуле главным библиотечным зданием служит Sanghuh Memorial Library, а площадку в Чхунджу в списке колледжей всегда обозначают отдельно.",
      ],
      fields: [
        "На сеульской площадке есть College of Veterinary Medicine, Sanghuh College of Life Sciences и College of Engineering. Из творческих направлений представлены College of Art and Design и отдельный College of Architecture. В Чхунджу работают College of Science and Technology и College of Medical Life Sciences. Названия колледжей показывают, как устроена подготовка: ветеринарная медицина выделена в самостоятельное подразделение, а науки о жизни представлены на обеих площадках под разными названиями.",
      ],
      international: [
        "Университетский международный раздел публикует объявления о приёме иностранных выпускников на бакалавриат. В списке материалов встречаются версии руководства на корейском, английском и китайском. Объявления о зачислении и документы по приёму идут в одной ленте, под разными заголовками. В структуре Konkuk есть и Konkuk Language Institute, выделенный отдельно от академических колледжей.",
      ],
      start: [
        "В международном разделе Konkuk открой доску 학부 안내. Твоё первое объявление для чтения — то, в названии которого есть 외국인특별전형 모집요강 и английское обозначение Admission Guidelines. В английской версии объявления для сеульского кампуса проверь, открыта ли выбранная кафедра для иностранного набора с казахстанским аттестатом.",
      ],
    },
    sources: [
      { title: "Konkuk University — объявления о международном приёме", url: "https://www.konkuk.ac.kr/bbs/ciss/1482/artclList.do" },
      { title: "Konkuk University — Википедия", url: "https://en.wikipedia.org/wiki/Konkuk_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ilgam_Lake_in_the_fall.jpg/1920px-Ilgam_Lake_in_the_fall.jpg",
      width: 1920,
      height: 1278,
      alt: "Вид сверху на озеро Ильгам и корпуса сеульского кампуса Konkuk University",
      author: "Konkukeditor",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Ilgam_Lake_in_the_fall.jpg",
    },
  },
  kookmin: {
    lead: "В Kookmin University один и тот же предмет может стать задачей автомобильного инженера, специалиста по транспортному дизайну или исследователя новых материалов.",
    facts: [
      { label: "Основан", value: "1946" },
      { label: "Тип", value: "Частный университет" },
      { label: "Город", value: "Сеул" },
      { label: "Район кампуса", value: "Сонбук" },
    ],
    sections: {
      overview: [
        "Частный университет начал работу в 1946 году, вскоре после освобождения Кореи. Его автомобильное направление начиналось с кафедры и разрослось в отдельный колледж. На кампусе есть исследовательский институт по автомобильным технологиям. Имя ещё одного человека из истории Kookmin, предпринимателя Ким Сонгона, осталось в названии Sungkok Library, главной университетской библиотеки.",
      ],
      campus: [
        "Кампус в квартале Чоннын района Сонбук расположен на склоне. Среди его корпусов выделяется Bugak Hall. Библиотека Sungkok переехала на эту площадку в 1971 году. Рядом с университетом находится исторический дом Myungwon Folk House. Он стоял в другой части Сеула и был перенесён и восстановлен возле кампуса. Благодаря этому рядом с современными учебными зданиями сохранился пример жилой архитектуры конца династии Чосон.",
      ],
      fields: [
        "В Kookmin автомобильная инженерия и создание внешнего облика транспорта относятся к разным подразделениям. В каталоге College of Automobile and Mobility перечислены Automotive Engineering, Automobile and IT Convergence и Future Mobility. В College of Design существует направление автомобильного и транспортного дизайна наряду с коммуникационным дизайном, керамикой и дизайном пространства. Например, в Automobile and IT Convergence вместе изучают автомобильные системы, электронику и программирование. В описании Future Mobility среди учебных тем есть планирование мобильности и интеллектуальные транспортные системы.",
      ],
      international: [
        "Вопросы иностранных кандидатов принимает International Affairs Team. На странице Undergraduate он указывает свой адрес в Global Center и разделяет Freshmen Admission и Transfer Admission. Для College of Design и College of Arts приведены отдельные строки с условиями. У университета есть и Korean Language Center. Он отвечает за занятия корейским, сведения о которых опубликованы в разделе Korean Language Program.",
      ],
      start: [
        "На англоязычном сайте Kookmin путь начинается с Admissions → Undergraduate → Admissions Guideline. Для выпускника школы нужна часть Freshmen Admission. Если интересует дизайн, посмотри её строку College of Design и соответствующее описание в Undergraduate Programs. Так требования к работам и школьным документам будут привязаны к тому подразделению, которое действительно принимает заявление.",
      ],
    },
    sources: [
      { title: "Kookmin University — колледж автомобильной инженерии", url: "https://english.kookmin.ac.kr/academics/undergraduates/automotive" },
      { title: "Kookmin University — колледж дизайна", url: "https://english.kookmin.ac.kr/academics/undergraduates/design" },
      { title: "Kookmin University — поступление на бакалавриат", url: "https://english.kookmin.ac.kr/admissions/undergraduate" },
      { title: "Kookmin University — Википедия", url: "https://en.wikipedia.org/wiki/Kookmin_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Kookmin_Univ_10.JPG/1920px-Kookmin_Univ_10.JPG",
      width: 1920,
      height: 1440,
      alt: "Въезд на территорию Kookmin University со стороны улицы",
      author: "hyolee2",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Kookmin_Univ_10.JPG",
    },
  },
  seoultech: {
    lead: "SeoulTech вырос из профессиональной школы, а сегодня на северной площадке в Сеуле соседствуют инженерные лаборатории и отделения керамики и дизайна.",
    facts: [
      { label: "Истоки", value: "Профессиональная школа, 1910" },
      { label: "Тип", value: "Национальный университет" },
      { label: "Город", value: "Сеул" },
      { label: "Район кампуса", value: "Новон" },
    ],
    sections: {
      overview: [
        "Первым предшественником национального SeoulTech была профессиональная школа, которая открыла двери в 1910 году. Позднее она стала промышленной школой, а затем техническим колледжем и университетом. Современное английское название Seoul National University of Science and Technology появилось в 2010 году. Сокращение SeoulTech отличает его от Seoul National University, чьи инженерные подразделения прежде занимали территорию нынешнего кампуса SeoulTech.",
      ],
      campus: [
        "Территория SeoulTech находится на севере Сеула в районе Новон. В Центральной библиотеке есть залы для индивидуальных занятий и помещения для групповой работы. На кампусе также находятся General Laboratory Building, Information and Computer Center и Institute for Language Education and Research. Для технического университета здесь заметно и присутствие искусства: в структуре кампуса есть помещения колледжа искусства и дизайна. Городской адрес университетского отдела международного приёма указан на той же территории.",
      ],
      fields: [
        "College of Engineering включает Mechanical & Automotive Engineering, Materials Science & Engineering и School of Architecture. У архитектуры и архитектурной инженерии в перечне отдельные программы. Вычислительные направления относятся к College of Information and Communication Engineering, где есть Computer Science and Engineering и Electronic and IT Media Engineering. В College of Art and Design среди самостоятельных направлений представлены Ceramic Arts and Design и Metal Arts & Design. Так материалы изучают и в инженерии, и в художественных мастерских.",
      ],
      international: [
        "За поступление отвечает Office of International Affairs. В его руководстве есть блок English-Track in undergraduate course. Среди перечисленных там подразделений — IT Management и Global IT Convergence. В другом пункте того же сайта опубликованы Korean Language Programs. Творческие направления отмечены в списке документов отдельно: для части программ колледжа искусства и дизайна предусмотрены требования к портфолио.",
      ],
      start: [
        "На сайте SeoulTech пункт Admission Guide находится внутри Apply → Undergraduate Admission. Если твоя цель — английский трек, найди одноимённый блок в опубликованном руководстве и сверь программу по её полному названию. Для творческого направления в этом же разделе есть отдельная часть Required documents, где можно проверить, какие работы подавать со школьными бумагами.",
      ],
    },
    sources: [
      { title: "SeoulTech — международный приём на бакалавриат", url: "https://global.seoultech.ac.kr/apply/undergraduate" },
      { title: "Seoul National University of Science and Technology — Википедия", url: "https://en.wikipedia.org/wiki/Seoul_National_University_of_Science_and_Technology" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/%EC%84%9C%EC%9A%B8%EA%B3%BC%ED%95%99%EA%B8%B0%EC%88%A0%EB%8C%80%ED%95%99%EA%B5%90_Seoul_National_University_of_Technology.jpg/1920px-%EC%84%9C%EC%9A%B8%EA%B3%BC%ED%95%99%EA%B8%B0%EC%88%A0%EB%8C%80%ED%95%99%EA%B5%90_Seoul_National_University_of_Technology.jpg",
      width: 1920,
      height: 1280,
      alt: "Спортивное поле и учебные корпуса SeoulTech на фоне холмов",
      author: "HeungSoon",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      filePage: "https://commons.wikimedia.org/wiki/File:%EC%84%9C%EC%9A%B8%EA%B3%BC%ED%95%99%EA%B8%B0%EC%88%A0%EB%8C%80%ED%95%99%EA%B5%90_Seoul_National_University_of_Technology.jpg",
    },
  },
  uos: {
    lead: "В University of Seoul сам город становится предметом учёбы: от устройства пересадок до городского управления и ландшафтного проектирования.",
    facts: [
      { label: "Истоки", value: "Сельскохозяйственная школа, 1918" },
      { label: "Тип", value: "Муниципальный университет" },
      { label: "Город", value: "Сеул" },
      { label: "Район кампуса", value: "Тондэмун" },
    ],
    sections: {
      overview: [
        "История UOS началась в 1918 году с сельскохозяйственной школы Кёнсона. Сегодня город Сеул управляет им как муниципальным университетом. Городские исследования постепенно оформились в особый академический профиль: сначала появилось подразделение последипломного образования по городскому управлению, а в нынешней структуре бакалавриата есть College of Urban Science. Университет также организует программы непрерывного образования для жителей Сеула.",
      ],
      campus: [
        "Кампус расположен в районе Тондэмун. На карте выделяются Cheonnong Hall и Centennial Memorial Hall, а также University Center, где находится контакт для вопросов о приёме. Для архитектуры и строительной инженерии обозначен отдельный корпус. В Baebong Hall размещаются подразделения, связанные с городской инженерией и ландшафтной архитектурой. Карта также показывает университетский музей и корпус дизайна и скульптуры. Такие соседства отражают широкий диапазон городских тем на одном кампусе.",
      ],
      fields: [
        "В College of Urban Science представлены Urban Administration, Urban Sociology, Transportation Engineering и Landscape Architecture. У Urban Planning and Design своя программа. Инженерия транспорта занимается системой перемещений, ландшафтная архитектура связана с проектированием открытых пространств, а у городской социологии в центре внимания жизнь людей в городе. За пределами этого колледжа можно изучать Public Administration в College of Public Affairs and Economics или Statistics в College of Natural Science.",
      ],
      international: [
        "В разделе International Admission опубликовано руководство Undergraduate International Student Admission Guide в нескольких языковых версиях, включая английскую. Рядом с руководством есть отдельные переходы Apply и Download Application Forms. В меню этого же сайта представлены Seoul International Summer School и Seoul International Winter School. Эти программы вынесены в собственные разделы, отдельно от материалов поступления на бакалавриат.",
      ],
      start: [
        "Если тебя привлекает транспорт или городское проектирование, начни с International Admission → Admission Guideline и выбери строку 학부 (Undergraduate). Рядом с английским руководством размещены формы заявления. Сверь название программы из College of Urban Science со списком набора и проверь, какие документы принимаются от выпускников школ Казахстана.",
      ],
    },
    sources: [
      { title: "University of Seoul — карта кампуса", url: "https://uos.ac.kr/eng/web/contents/UOS_About_07_01_01" },
      { title: "University of Seoul — руководство по поступлению", url: "https://his.uos.ac.kr/oia/web/contents/OIA_Admission_01" },
      { title: "University of Seoul — Википедия", url: "https://en.wikipedia.org/wiki/University_of_Seoul" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/%EC%84%9C%EC%9A%B8%EC%8B%9C%EB%A6%BD%EB%8C%80%ED%95%99%EA%B5%90_%EC%A0%84%EB%86%8D%EA%B4%80.jpg/1920px-%EC%84%9C%EC%9A%B8%EC%8B%9C%EB%A6%BD%EB%8C%80%ED%95%99%EA%B5%90_%EC%A0%84%EB%86%8D%EA%B4%80.jpg",
      width: 1920,
      height: 1440,
      alt: "Площадь и ряд колонн перед корпусом Чоннон в University of Seoul",
      author: "Younghopark7",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:%EC%84%9C%EC%9A%B8%EC%8B%9C%EB%A6%BD%EB%8C%80%ED%95%99%EA%B5%90_%EC%A0%84%EB%86%8D%EA%B4%80.jpg",
    },
  },
  inha: {
    lead: "Название Inha University соединяет Инчхон и Гавайи, а история его инженерных программ началась с кораблестроения, машиностроения и других промышленных специальностей.",
    facts: [
      { label: "Истоки", value: "Политехнический институт, 1954" },
      { label: "Тип", value: "Частный университет" },
      { label: "Город", value: "Инчхон" },
      { label: "Район кампуса", value: "Мичхухоль" },
    ],
    sections: {
      overview: [
        "В 1954 году в Инчхоне открылся Inha Institute of Technology. В создании института участвовали корейцы, жившие на Гавайях, что отражено в его названии: «Ин» происходит от Инчхона, «Ха» — от Гавайев. В раннем перечне были металлургия, судостроение, электротехника и химическая инженерия. Позднее институт получил университетский статус. Сегодня Inha остаётся частным университетом с инженерным профилем и более широким набором колледжей.",
      ],
      campus: [
        "Площадка находится в инчхонском районе Мичхухоль. В кампус входит Jungseok Memorial Library, стеклянный корпус которой виден на фотографии. В англоязычных адресах эта площадка обозначается как 100 Inha-ro, Incheon. У библиотеки есть отдельная англоязычная страница для учащихся бакалавриата. На сайте International Center город тоже выделен в отдельный раздел About Incheon. Он входит в более широкое меню Life at INHA вместе с информацией о транспорте и повседневной жизни. Для приезжающего впервые это даёт контекст за пределами учебных корпусов.",
      ],
      fields: [
        "В актуальном перечне Inha есть College of Engineering, College of Natural Sciences, College of Business Administration и College of International Studies. Инженерная специализация видна также по Research Institute of Ship and Ocean Engineering. С университетом связана Asia Pacific School of Logistics. Морская инженерия и логистика относятся к разным профессиональным областям: в первом случае ключевой вопрос — устройство технических систем, во втором — организация потока грузов и информации.",
      ],
      international: [
        "International Center публикует сведения об International Admission, а для участников обмена ведёт отдельное меню Incoming. В разделе Life at INHA есть International Student Lounge и Counseling Services. Информация об изучении корейского выделена на университетском сайте под названием Korean Language Education Center. Бакалавриат, языковые занятия и обмен таким образом представлены отдельными маршрутами с собственными страницами.",
      ],
      start: [
        "У Inha нужная вкладка находится под International → Admission → Undergraduate на англоязычном сайте. Она относится к началу дипломной программы. После выбора колледжа сверь эту вкладку с названием направления в Undergraduate Programs Bulletin, чтобы при вопросе о казахстанском аттестате назвать приёмной команде конкретную программу.",
      ],
    },
    sources: [
      { title: "Inha University — библиотека Jungseok", url: "https://lib.inha.ac.kr/en/guide/user/student" },
      { title: "Inha University — официальный сайт", url: "https://www.inha.ac.kr/eng/index.do" },
      { title: "Inha University — международный отдел", url: "https://internationalcenter.inha.ac.kr/internationalcenter/index.do" },
      { title: "Inha University — Википедия", url: "https://en.wikipedia.org/wiki/Inha_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/%EC%9D%B8%ED%95%98%EB%8C%80%ED%95%99%EA%B5%90_%EC%A0%95%EC%84%9D%ED%95%99%EC%88%A0%EC%A0%95%EB%B3%B4%EA%B4%80.jpg/1920px-%EC%9D%B8%ED%95%98%EB%8C%80%ED%95%99%EA%B5%90_%EC%A0%95%EC%84%9D%ED%95%99%EC%88%A0%EC%A0%95%EB%B3%B4%EA%B4%80.jpg",
      width: 1920,
      height: 1440,
      alt: "Библиотека Jungseok со стеклянным фасадом и газоном перед ней",
      author: "Ifflies",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:%EC%9D%B8%ED%95%98%EB%8C%80%ED%95%99%EA%B5%90_%EC%A0%95%EC%84%9D%ED%95%99%EC%88%A0%EC%A0%95%EB%B3%B4%EA%B4%80.jpg",
    },
  },
  ajou: {
    lead: "Ajou University в Сувоне вырос из корейско-французского проекта инженерного образования и сегодня объединяет инженерные колледжи, вычислительные программы и университетскую больницу.",
    facts: [
      { label: "Истоки", value: "Инженерный колледж, 1973" },
      { label: "Тип", value: "Частный университет" },
      { label: "Город", value: "Сувон" },
      { label: "Район кампуса", value: "Йонтхон" },
    ],
    sections: {
      overview: [
        "Ajou начал работу как инженерный колледж в 1973 году. Южная Корея и Франция сотрудничали в его создании, чтобы развивать обмен опытом в техническом образовании. Позднее учебное заведение выросло в частный университет. Инженерная история читается по нынешней структуре: наряду с College of Engineering есть отдельные колледжи информационных технологий и вычислительных дисциплин. Медицина и естественные науки существуют как самостоятельные академические направления.",
      ],
      campus: [
        "Площадка находится в районе Йонтхон города Сувон. В перечне университетских служб корпус Вончхон указан под названием Woncheon Hall. Центральная библиотека открылась в том же году, что и первоначальный колледж. На схеме кампуса библиотека и учебные корпуса обозначены отдельно. Больница Ajou University Hospital расположена на той же университетской территории и связана с медицинской школой Ajou.",
      ],
      fields: [
        "В перечень бакалавриата входят College of Engineering, College of Computing and Informatics, College of Information and Technology и College of Natural Sciences. Там же представлено подразделение биоконвергентной инженерии, где соединяют биологические и инженерные дисциплины. School of Business и College of Nursing расширяют спектр направлений за пределами инженерии. Научные направления представлены и в медицинской части Ajou: в университетском каталоге есть также School of Medicine и College of Pharmacy.",
      ],
      international: [
        "Англоязычный сайт International Admissions отдельно описывает бакалавриат и Korean Language. Для бакалавриата под заголовком Admission Information есть Admission Procedure, руководство вместе со ссылкой на онлайн-заявление и страница университетского теста по корейскому. Англоязычная инструкция для иностранных абитуриентов опубликована рядом с корейской версией. Контакт отдела указан внизу страницы, где собраны документы и переход к подаче.",
      ],
      start: [
        "Загляни в Undergraduate → Admission Information → Admission Guide/Online Application. В этом разделе Ajou держит рядом английское руководство и переход к самой заявке. Выбери руководство прежде, чем вводить данные: там можно проверить, как представить школьную выписку из Казахстана и в каком колледже искать нужную вычислительную или инженерную специальность.",
      ],
    },
    sources: [
      { title: "Ajou University — карта кампуса", url: "https://ict.ajou.ac.kr/en/intro/way01.do" },
      { title: "Ajou University — корпуса и службы кампуса", url: "https://ajou.ac.kr/edorm/facilities/campus.do" },
      { title: "Ajou University — поступление на бакалавриат", url: "https://www.ajou.ac.kr/iadmissions_en/undergraduate/guideline.do" },
      { title: "Ajou University — Википедия", url: "https://en.wikipedia.org/wiki/Ajou_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/AjouUniv.jpg/1920px-AjouUniv.jpg",
      width: 1920,
      height: 1080,
      alt: "Корпус Вончхон в кампусе Ajou University за деревьями",
      author: "주전자",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      filePage: "https://commons.wikimedia.org/wiki/File:AjouUniv.jpg",
    },
  },
  pusan: {
    lead: "В Pusan National University морскую инженерию, океанографию и археологию можно встретить в одном каталоге, хотя у университета несколько отдельных кампусов.",
    facts: [
      { label: "Основан", value: "1946" },
      { label: "Тип", value: "Национальный университет" },
      { label: "Кампусы в Пусане", value: "Пусан и Ами" },
      { label: "Кампусы за пределами Пусана", value: "Янсан и Мирян" },
    ],
    sections: {
      overview: [
        "PNU — национальный университет, который ведёт историю с 1946 года. В официальном названии сохранилось написание Pusan, а город на англоязычной карте кампусов называется Busan. Та же разница видна в университетском меню: у названия учреждения одна форма, у карт и маршрутов — другая. Главную площадку университет обозначает как Busan Campus.",
      ],
      campus: [
        "Кампус Busan находится в районе Кымджон. На его карте отмечены прежние и нынешние главные ворота, здание администрации, корпуса физики, Mechanical Technology Center и университетский музей. На той же площадке обозначены International Language Institute и Sangnam International House. Возле главной площадки находится одноимённая станция метро. В Пусане работает также кампус Ами. Для площадок в Янсане и Миряне у университета отдельные карты. Пусанские площадки и две площадки за пределами города перечислены как самостоятельные вкладки Campus map.",
      ],
      fields: [
        "College of Engineering включает Naval Architecture and Ocean Engineering, машиностроение и аэрокосмическую инженерию. Океанографию преподают в College of Natural Sciences, где есть также геология и науки об атмосфере. Морская инженерия и океанография здесь относятся к разным колледжам. В College of Humanities находятся кафедры археологии, философии и русского языка и литературы. В общем перечне есть и художественные программы, например Korean Music и Art, Culture and Image.",
      ],
      international: [
        "На доске Admission Notice университет публикует Undergraduate Program Admissions Guide и отдельные руководства для некоторых форматов набора. Среди опубликованных объявлений есть Special On-site Undergraduate Admissions Guide, где Казахстан обозначен сокращением KAZ. Это название отдельного объявления, а основной бакалаврский маршрут ведёт к общему руководству для иностранных кандидатов.",
      ],
      start: [
        "На доске Admission Notice найди именно Undergraduate Program Admissions Guide. Если видишь и обычный набор, и отдельный выездной, сверь, какой из вариантов относится к твоему случаю. Уже после этого сопоставь название из руководства с кафедрой в Academics → Undergraduate: так найдёшь программу и её кампус под названиями, которыми пользуется университет.",
      ],
    },
    sources: [
      { title: "Pusan National University — международный приём", url: "https://international.pusan.ac.kr/bbs/international/2089/artclList.do" },
      { title: "Pusan National University — программы бакалавриата", url: "https://www.pusan.ac.kr/eng/CMS/OrganizationMgr/Undergraduate.do?mCode=MN019" },
      { title: "Pusan National University — карта кампуса", url: "https://www.pusan.ac.kr/eng/CMS/Contents/Contents.do?mCode=MN052" },
      { title: "Pusan National University — адрес кампуса Busan", url: "https://www.pusan.ac.kr/eng/CMS/Contents/Contents.do?mCode=MN053" },
      { title: "Pusan National University — Википедия", url: "https://en.wikipedia.org/wiki/Pusan_National_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Administration_bldg_-_PNU.jpg/1920px-Administration_bldg_-_PNU.jpg",
      width: 1920,
      height: 1440,
      alt: "Здание администрации и площадь в пусанском кампусе Pusan National University",
      author: "Modamoda",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:Administration_bldg_-_PNU.jpg",
    },
  },
  knu: {
    lead: "Kyungpook National University вырос из колледжей Тэгу и сегодня распределяет инженерные, медицинские и сельскохозяйственные направления между несколькими площадками.",
    facts: [
      { label: "Тип", value: "Национальный университет" },
      { label: "Главный кампус", value: "Пукку, Тэгу" },
      { label: "Кампус вне Тэгу", value: "Санджу" },
      { label: "Медицинские кампусы в Тэгу", value: "Тонин и Чхильгок" },
    ],
    sections: {
      overview: [
        "KNU образовался при объединении учебных заведений Тэгу. Среди его предшественников были колледжи образования, медицины и сельского хозяйства. Собственную историю медицинская школа ведёт от учебного заведения, открытого в Тэгу в 1923 году. Затем к ним присоединились подразделения гуманитарных и естественных наук, права и политических дисциплин. Позднее появились инженерный и стоматологический колледжи. Эта история объясняет, почему у национального университета рядом существуют сильные технические, медицинские и аграрные профили.",
      ],
      campus: [
        "Главный кампус находится в районе Пукку в Тэгу. Там сосредоточены инженерные и естественно-научные подразделения и университетская администрация. В центральной части Тэгу кампус Тонин связан с медициной, сестринским делом и стоматологией. Площадка Чхильгок тоже имеет медицинский профиль. В Санджу, где работает ещё один кампус, предусмотрены учебные объекты другого типа, в том числе ферма и ветеринарная больница.",
      ],
      fields: [
        "На странице бакалавриата среди колледжей перечислены College of Engineering, College of IT Engineering и College of Agriculture and Life Sciences. Названия подразделений показывают, как у KNU разделены технические дисциплины и науки о жизни. В той же структуре представлены College of Music and Arts и Teachers’ College. Учёба в медицинском подразделении связана с университетской больницей, а в Санджу работы с животными и ветеринария опираются на свои площадки.",
      ],
      international: [
        "На английской странице Undergraduate опубликованы руководство на нескольких языках и отдельная инструкция к онлайн-заявлению. В блоке Contact Us приведён адрес Office of International Affairs на главном кампусе в Тэгу. Korean Language Program ведёт на материалы о занятиях корейским, у которых свой контакт и отдельная процедура записи. В университетском меню этот пункт находится рядом с программами обмена.",
      ],
      start: [
        "Перейди в International → Academic Degree Program → Undergraduate и открой раздел International Students. Если на странице доступно несколько версий руководства, ищи английскую инструкцию для поступающих на первый курс. Проверь по ней, какой адрес кампуса указан у нужной программы, и используй Guide to online application, когда подготовишь документы казахстанской школы.",
      ],
    },
    sources: [
      { title: "Kyungpook National University — программа корейского языка", url: "https://en.knu.ac.kr/admission/korean01.htm" },
      { title: "Kyungpook National University — международный приём на бакалавриат", url: "https://en.knu.ac.kr/admission/foreign01.htm" },
      { title: "Kyungpook National University — Википедия", url: "https://en.wikipedia.org/wiki/Kyungpook_National_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/KNU_Campus_Daegu.jpg/1920px-KNU_Campus_Daegu.jpg",
      width: 1920,
      height: 1309,
      alt: "Сад и учебные корпуса кампуса Kyungpook National University в Тэгу",
      author: "Knuoia",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:KNU_Campus_Daegu.jpg",
    },
  },
  chonnam: {
    lead: "У Chonnam National University в Кванджу есть колледж сельского хозяйства и наук о жизни, а в Йосу — самостоятельный колледж рыболовства и морских наук.",
    facts: [
      { label: "Основан", value: "1952" },
      { label: "Тип", value: "Национальный университет" },
      { label: "Кампус в Кванджу", value: "Йонбон" },
      { label: "Другой кампус", value: "Йосу" },
    ],
    sections: {
      overview: [
        "Национальный университет появился в 1952 году, когда несколько колледжей провинции объединились. Позднее в его состав вошёл Yosu National University. Так сложился университет с площадками в Кванджу и Йосу, где часть направлений распределена по разным городам. В описании нынешней структуры упоминается также Хвасун. Хвасун упоминается как часть кампусной системы CNU, наряду с Кванджу и Йосу.",
      ],
      campus: [
        "Кампус Йонбон расположен в районе Пукку города Кванджу. На этой площадке находится G&R Hub, в котором размещён международный отдел. У кампуса есть Центральная библиотека. На фотографии виден её кирпичный корпус. Свой главный вход ведёт на территорию кампуса в Йосу, где находится отдельное здание студенческого союза. За аббревиатурой CNU на странице колледжа может стоять один из этих кампусов: город указан в университетском перечне вместе с подразделением.",
      ],
      fields: [
        "В Кванджу работают College of Agriculture & Life Sciences, College of Natural Sciences и College of Artificial Intelligence Convergence. С инженерией там связан College of Engineering. В Йосу действует собственный College of Engineering Sciences, а также College of Culture & Social Sciences. Для занятий рыболовством и морскими науками на площадке Йосу отведён College of Fisheries & Ocean Sciences. Благодаря такому распределению естественно-научные области в Кванджу и морская специализация в Йосу читаются как разные профили.",
      ],
      international: [
        "На сайте Office of International Affairs материалы для бакалавриата собраны в Undergraduate. Страница включает Admission Guideline, формы заявления, ссылку на онлайн-подачу и отдельное описание Departmental Evaluation Method. Рядом с ней в меню есть Korean Language Course, ведущий к языковой подготовке. Инструкции по записи на корейский открываются через другой пункт, чем документы на дипломную программу.",
      ],
      start: [
        "Здесь удобно начать с Departmental Evaluation Method внутри Admission → Undergraduate. У отдела есть английская версия, по которой можно понять, как рассматривают заявление именно на выбранную кафедру. Затем загляни в соседний Admission Guideline и проверь, как оформить документы казахстанской школы и где расположен выбранный колледж — в Кванджу или Йосу.",
      ],
    },
    sources: [
      { title: "Chonnam National University — международный приём", url: "https://international.jnu.ac.kr/Admission/Undergraduate" },
      { title: "Chonnam National University — Википедия", url: "https://en.wikipedia.org/wiki/Chonnam_National_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/CNU_University_Library_Red.JPG/1920px-CNU_University_Library_Red.JPG",
      width: 1920,
      height: 1440,
      alt: "Красный кирпичный корпус библиотеки Chonnam National University за деревьями",
      author: "Wikicnu",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0",
      filePage: "https://commons.wikimedia.org/wiki/File:CNU_University_Library_Red.JPG",
    },
  },
  jeju: {
    lead: "Jeju National University соединяет две университетские истории на острове Чеджу и предлагает собственные программы по морской среде и педагогике.",
    facts: [
      { label: "Истоки", value: "Колледж Чеджу, 1952" },
      { label: "Тип", value: "Национальный университет" },
      { label: "Город", value: "Чеджу" },
      { label: "Кампусы", value: "Ара и Сара" },
    ],
    sections: {
      overview: [
        "Университет ведёт историю от провинциального колледжа, открытого в городе Чеджу в 1952 году. Позднее колледж стал национальным и получил университетский статус. В 2008 году к нему присоединился педагогический университет Чеджу. Сегодня историческая связь заметна по структуре кампусов: педагогический колледж представлен на отдельной площадке, а название Jeju National University относится ко всему национальному университету.",
      ],
      campus: [
        "В городе Чеджу расположены кампусы Ара и Сара. Office of International Affairs указывает адрес в Ara Muse Hall на кампусе Ара. Для площадки Сара в университетских маршрутах упоминается остановка Teachers College. На сайте есть две отдельные страницы Campus Guide с направлениями от аэропорта и городской администрации. Для каждой площадки университет указывает свой адрес и точку прибытия, так что даже внутри одного города названия Ара и Сара имеют практический смысл.",
      ],
      fields: [
        "College of Ocean Sciences изучает морскую среду и использование морских ресурсов. В его описании представлены Marine Life Science и Earth and Ocean Science. Среди тем последнего направления — морская геология, физическая океанография и науки об атмосфере. В описании курса отдельно отмечена практика измерений на учебном судне. В структуре университета есть также College of Applied Life Sciences, College of Engineering и College of Art & Design. Специализация по океану занимает отдельное место между естественными науками острова и инженерными дисциплинами.",
      ],
      international: [
        "У международного отдела есть отдельный Undergraduate Admission Guide for International Students. На странице рядом находятся корейский и английский тексты, формы и контакт для вопросов. Для занятий корейским у отдела есть своя страница записи. На ней опубликованы отдельное руководство на английском и порядок подачи заявления на языковые курсы.",
      ],
      start: [
        "Начни с английского файла под заголовком Undergraduate Admission Guide for International Students в разделе Admission → Undergraduate. По нему можно узнать, входит ли нужная морская специальность в международный набор. Формы идут отдельной ссылкой FORM. Перед их заполнением сверь с руководством оформление аттестата и выписки из Казахстана.",
      ],
    },
    sources: [
      { title: "Jeju National University — кампус Ара", url: "https://jejunu.ac.kr/eng/intro/guide/directions/aracampus.htm" },
      { title: "Jeju National University — науки о Земле и океане", url: "https://www.jejunu.ac.kr/eng/university/colleges/ocean/earth/intro.htm" },
      { title: "Jeju National University — поступление на бакалавриат", url: "https://intleng.jejunu.ac.kr/intleng/admission/department/undergraduate.htm" },
      { title: "Jeju National University — запись на курсы корейского", url: "https://intleng.jejunu.ac.kr/intleng/koreanlanguage/koradmissions/schedule.htm" },
      { title: "Jeju National University — кампус Сара", url: "https://jejunu.ac.kr/eng/intro/guide/directions/saracampus.htm" },
      { title: "Jeju National University — Википедия", url: "https://en.wikipedia.org/wiki/Jeju_National_University" },
    ],
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/JNU_-_Sara_Campus.jpeg/1920px-JNU_-_Sara_Campus.jpeg",
      width: 1920,
      height: 764,
      alt: "Площадь и здание с круглой башней в кампусе Сара",
      author: "Nt",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      filePage: "https://commons.wikimedia.org/wiki/File:JNU_-_Sara_Campus.jpeg",
    },
  },
};
