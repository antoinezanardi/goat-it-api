import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionRejection } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionDocument, createFakeQuestionThemeAssignmentDocument } from "@faketories/contexts/question/mongoose-document/question.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import { FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY, FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY, FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY, FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY, FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

const FIVE_QUESTIONS_FIXTURE_SET = [
  createFakeQuestionDocument({
    _id: createFakeObjectId("a1b2c3d4e5f6012345678901"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Which director is known for the movie 'Psycho' (1960)?",
        fr: "Quel réalisateur est connu pour le film 'Psychose' (1960)?",
        it: "Quale regista è noto per il film 'Psycho' (1960)?",
        pt: "Qual diretor é conhecido pelo filme 'Psicose' (1960)?",
        es: "¿Qué director es conocido por la película 'Psicosis' (1960)?",
        de: "Welcher Regisseur ist für den Film 'Psycho' (1960) bekannt?",
      }),
      answer: createFakeLocalizedText({
        en: "Alfred Hitchcock",
        fr: "Alfred Hitchcock",
        it: "Alfred Hitchcock",
        pt: "Alfred Hitchcock",
        es: "Alfred Hitchcock",
        de: "Alfred Hitchcock",
      }),
      context: createFakeLocalizedText({
        en: "Alfred Hitchcock directed the 1960 psychological horror film 'Psycho', which became one of his most famous works.",
        fr: "Alfred Hitchcock a réalisé le film d'horreur psychologique 'Psychose' en 1960, devenu l'une de ses œuvres les plus célèbres.",
        it: "Alfred Hitchcock ha diretto il film horror psicologico 'Psycho' del 1960, che è diventato una delle sue opere più famose.",
        pt: "Alfred Hitchcock dirigiu o filme de horror psicológico 'Psycho' em 1960, que se tornou uma de suas obras mais famosas.",
        es: "Alfred Hitchcock dirigió la película de terror psicológico 'Psycho' en 1960, que se convirtió en una de sus obras más famosas.",
        de: "Alfred Hitchcock inszenierte den psychologischen Horrorfilm 'Psycho' (1960), der zu einem seiner berühmtesten Werke wurde.",
      }),
      trivia: createFakeLocalizedTexts({
        en: ["'Psycho' is famous for its shower scene, scored by Bernard Herrmann."],
        fr: ["'Psychose' est célèbre pour sa scène de douche, composée par Bernard Herrmann."],
        it: ["'Psycho' è famoso per la scena della doccia, musicata da Bernard Herrmann."],
        pt: ["'Psycho' é famoso por sua cena do chuveiro, com trilha sonora de Bernard Herrmann."],
        es: ["'Psycho' es famoso por su escena de la ducha, musicalizada por Bernard Herrmann."],
        de: ["'Psycho' ist berühmt für seine Duschszene, die von Bernard Herrmann vertont wurde."],
      }),
    }),
    cognitiveDifficulty: "medium",
    author: createFakeQuestionAuthorAggregate({
      role: "admin",
      name: "Antoine ZANARDI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Psycho_(1960_film)"],
    status: "active",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("b2c3d4e5f6a7012345678902"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Which band released the album 'Dark Side of the Moon'?",
        fr: "Quel groupe a sorti l'album 'Dark Side of the Moon'?",
        it: "Quale band ha pubblicato l'album 'The Dark Side of the Moon'?",
        pt: "Qual banda lançou o álbum 'The Dark Side of the Moon'?",
        es: "¿Qué banda lanzó el álbum 'The Dark Side of the Moon'?",
        de: "Welche Band veröffentlichte das Album 'The Dark Side of the Moon'?",
      }),
      answer: createFakeLocalizedText({
        en: "Pink Floyd",
        fr: "Pink Floyd",
        it: "Pink Floyd",
        pt: "Pink Floyd",
        es: "Pink Floyd",
        de: "Pink Floyd",
      }),
      context: createFakeLocalizedText({
        en: "'The Dark Side of the Moon' is a 1973 album by Pink Floyd, noted for its progressive rock elements.",
        fr: "'The Dark Side of the Moon' est un album de 1973 de Pink Floyd, connu pour ses éléments de rock progressif.",
        it: "'The Dark Side of the Moon' è un album del 1973 dei Pink Floyd, noto per i suoi elementi di rock progressivo.",
        pt: "'The Dark Side of the Moon' é um álbum de 1973 do Pink Floyd, conhecido por seus elementos de rock progressivo.",
        es: "'The Dark Side of the Moon' es un álbum de 1973 de Pink Floyd, conocido por sus elementos de rock progresivo.",
        de: "'The Dark Side of the Moon' ist ein 1973er Album von Pink Floyd, bekannt für seine Elemente des Progressive Rock.",
      }),
      trivia: createFakeLocalizedTexts({
        en: ["The album stayed on the Billboard charts for a record-breaking number of weeks."],
        fr: ["L'album est resté dans les charts Billboard pendant un nombre record de semaines."],
        it: ["L'album è rimasto nelle classifiche Billboard per un numero record di settimane."],
        pt: ["O álbum permaneceu nas paradas da Billboard por um número recorde de semanas."],
        es: ["El álbum se mantuvo en las listas de Billboard durante un número récord de semanas."],
        de: ["Das Album hielt sich rekordverdächtig lange in den Billboard-Charts."],
      }),
    }),
    cognitiveDifficulty: "hard",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "Music AI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon"],
    status: "pending",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("c3d4e5f6a7b8012345678903"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY._id,
        isHint: true,
        isPrimary: false,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Which country won the FIFA World Cup in 2018?",
        fr: "Quel pays a remporté la Coupe du Monde de la FIFA en 2018?",
        it: "Quale paese ha vinto la Coppa del Mondo FIFA nel 2018?",
        pt: "Qual país venceu a Copa do Mundo da FIFA em 2018?",
        es: "¿Qué país ganó la Copa Mundial de la FIFA en 2018?",
        de: "Welches Land gewann die FIFA-Weltmeisterschaft 2018?",
      }),
      answer: createFakeLocalizedText({
        en: "France",
        fr: "France",
        it: "Francia",
        pt: "França",
        es: "Francia",
        de: "Frankreich",
      }),
      context: createFakeLocalizedText({
        en: "France won the 2018 FIFA World Cup held in Russia, defeating Croatia in the final.",
        fr: "La France a remporté la Coupe du Monde de la FIFA 2018 en Russie, en battant la Croatie en finale.",
        it: "La Francia ha vinto la Coppa del Mondo FIFA 2018 tenutasi in Russia, sconfiggendo la Croazia in finale.",
        pt: "A França venceu a Copa do Mundo da FIFA 2018 realizada na Rússia, derrotando a Croácia na final.",
        es: "Francia ganó la Copa Mundial de la FIFA 2018 celebrada en Rusia, derrotando a Croacia en la final.",
        de: "Frankreich gewann die FIFA-Weltmeisterschaft 2018 in Russland und besiegte Kroatien im Finale.",
      }),
      trivia: createFakeLocalizedTexts({
        en: ["The 2018 final score was 4-2 in favor of France."],
        fr: ["Le score final de 2018 était de 4-2 en faveur de la France."],
        it: ["Il punteggio finale del 2018 fu 4-2 a favore della Francia."],
        pt: ["O placar final de 2018 foi 4-2 a favor da França."],
        es: ["El marcador final de 2018 fue 4-2 a favor de Francia."],
        de: ["Das Endergebnis 2018 lautete 4:2 zugunsten Frankreichs."],
      }),
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "game",
      name: "Sports Desk",
      gameId: createFakeObjectId("32dafb5cfb677b53d1f7b60d"),
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/2018_FIFA_World_Cup"],
    status: "active",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("d4e5f6a7b8c9012345678904"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id,
        isHint: true,
        isPrimary: false,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Who was the first President of the United States?",
        fr: "Qui a été le premier président des États-Unis?",
        it: "Chi è stato il primo Presidente degli Stati Uniti?",
        pt: "Quem foi o primeiro Presidente dos Estados Unidos?",
        es: "¿Quién fue el primer Presidente de los Estados Unidos?",
        de: "Wer war der erste Präsident der Vereinigten Staaten?",
      }),
      answer: createFakeLocalizedText({
        en: "George Washington",
        fr: "George Washington",
        it: "George Washington",
        pt: "George Washington",
        es: "George Washington",
        de: "George Washington",
      }),
      context: createFakeLocalizedText({
        en: "George Washington served as the first President of the United States from 1789 to 1797.",
        fr: "George Washington a été le premier président des États-Unis de 1789 à 1797.",
        it: "George Washington è stato il primo Presidente degli Stati Uniti dal 1789 al 1797.",
        pt: "George Washington serviu como o primeiro Presidente dos Estados Unidos de 1789 a 1797.",
        es: "George Washington se desempeñó como el primer Presidente de los Estados Unidos de 1789 a 1797.",
        de: "George Washington war von 1789 bis 1797 der erste Präsident der Vereinigten Staaten.",
      }),
      trivia: createFakeLocalizedTexts({
        en: ["Washington is often called the 'Father of His Country'."],
        fr: ["Washington est souvent appelé le 'Père de son pays'."],
        it: ["Washington è spesso chiamato il 'Padre della sua Nazione'."],
        pt: ["Washington é frequentemente chamado de 'Pai de sua Pátria'."],
        es: ["Washington es a menudo llamado el 'Padre de su País'."],
        de: ["Washington wird oft der 'Vater seines Landes' genannt."],
      }),
    }),
    cognitiveDifficulty: "medium",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "History AI",
    }),
    rejection: createFakeQuestionRejection({
      type: "incorrect-information",
      comment: "Second theme assignment is not relevant to the question content.",
    }),
    sourceUrls: ["https://en.wikipedia.org/wiki/George_Washington"],
    status: "rejected",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("efd39a4ac3bdfd03d2f8cdf1"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Of which animal is the elephant phobic?",
        fr: "De quel animal l'éléphant est-il phobique ?",
        it: "Di quale animale ha paura l'elefante?",
        pt: "De qual animal o elefante tem fobia?",
        es: "¿De qué animal es fóbico el elefante?",
        de: "Vor welchem Tier hat der Elefant Angst?",
      }),
      answer: createFakeLocalizedText({
        en: "Bees",
        fr: "Les abeilles",
        it: "Le api",
        pt: "Abelhas",
        es: "Abejas",
        de: "Bienen",
      }),
      context: createFakeLocalizedText({
        en: "Elephants are not widely known for their fear of bees, which may seem surprising given their imposing size. However, this phobia is well documented, and elephants often avoid areas where bees are present.",
        fr: "Les éléphants ne sont pas vraiment connus pour leur peur des abeilles, ce qui peut sembler surprenant compte tenu de leur taille imposante. Cependant, cette phobie est bien documentée et les éléphants évitent souvent les zones où les abeilles sont présentes.",
        it: "Gli elefanti non sono ampiamente conosciuti per la loro paura delle api, il che può sembrare sorprendente data la loro imponente dimensione. Tuttavia, questa fobia è ben documentata e gli elefanti evitano spesso le aree dove sono presenti le api.",
        pt: "Os elefantes não são amplamente conhecidos por seu medo de abelhas, o que pode parecer surpreendente dado o seu tamanho imponente. No entanto, essa fobia é bem documentada, e os elefantes frequentemente evitam áreas onde as abelhas estão presentes.",
        es: "Los elefantes no son ampliamente conocidos por su miedo a las abejas, lo que puede parecer sorprendente dada su imponente tamaño. Sin embargo, esta fobia está bien documentada y los elefantes a menudo evitan las áreas donde hay abejas.",
        de: "Elefanten sind nicht allgemein für ihre Angst vor Bienen bekannt, was angesichts ihrer imposanten Größe überraschend erscheinen mag. Diese Phobie ist jedoch gut dokumentiert, und Elefanten meiden oft Gebiete, in denen Bienen vorhanden sind.",
      }),
      trivia: createFakeLocalizedTexts({
        en: ["Bees are used by some wildlife rangers to protect elephants from poachers, as elephants naturally avoid areas where bees are present."],
        fr: ["Les abeilles sont utilisées par certains gardiens de la faune pour protéger les éléphants des braconniers, car les éléphants évitent naturellement les zones où les abeilles sont présentes."],
        it: ["Le api sono utilizzate da alcuni guardiani della fauna selvatica per proteggere gli elefanti dai bracconieri, poiché gli elefanti evitano naturalmente le aree dove sono presenti le api."],
        pt: ["As abelhas são usadas por alguns guardas florestais para proteger os elefantes dos caçadores furtivos, pois os elefantes evitam naturalmente áreas onde as abelhas estão presentes."],
        es: ["Las abejas son utilizadas por algunos guardabosques para proteger a los elefantes de los cazadores furtivos, ya que los elefantes evitan naturalmente las áreas donde hay abejas."],
        de: ["Bienen werden von einigen Wildhütern verwendet, um Elefanten vor Wilderern zu schützen, da Elefanten Gebiete meiden, in denen Bienen vorhanden sind."],
      }),
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "AI Question Generator",
    }),
    rejection: undefined,
    sourceUrls: ["https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science"],
    status: "archived",
  }),
] as const satisfies ReturnType<typeof createFakeQuestionDocument>[];

export {
  FIVE_QUESTIONS_FIXTURE_SET,
};