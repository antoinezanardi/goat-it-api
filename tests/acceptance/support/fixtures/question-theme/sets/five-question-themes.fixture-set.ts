import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("8ef21e4eb04eb0fa5a469d87"),
  slug: "cinema",
  label: createFakeLocalizedText({
    fr: "Cinéma",
    en: "Cinema",
    it: "Cinema",
    pt: "Cinema",
    es: "Cine",
    de: "Kino",
  }),
  aliases: createFakeLocalizedTexts({
    fr: ["Films", "Ciné"],
    en: ["Movies", "Films"],
    it: ["Film", "Pellicole"],
    pt: ["Filmes", "Cinema"],
    es: ["Películas", "Cine"],
    de: ["Filme", "Kino"],
  }),
  description: createFakeLocalizedText({
    fr: "Thème concernant le cinéma et les films.",
    en: "Theme about cinema and movies.",
    it: "Argomento sul cinema e i film.",
    pt: "Tema sobre o cinema e filmes.",
    es: "Tema sobre cine y películas.",
    de: "Thema über Kino und Filme.",
  }),
  status: "active",
});

const FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("ddb03d94cae8df38d28e5adc"),
  slug: "music",
  label: createFakeLocalizedText({
    fr: "Musique",
    en: "Music",
    it: "Musica",
    pt: "Música",
    es: "Música",
    de: "Musik",
  }),
  aliases: createFakeLocalizedTexts({
    fr: ["Chanson", "Son"],
    en: ["Songs", "Tunes"],
    it: ["Canzoni", "Brani"],
    pt: ["Canções", "Músicas"],
    es: ["Canciones", "Melodías"],
    de: ["Lieder", "Melodien"],
  }),
  description: createFakeLocalizedText({
    fr: "Thème lié à la musique, aux artistes et aux genres musicaux.",
    en: "Theme about music, artists and music genres.",
    it: "Argomento sulla musica, artisti e generi musicali.",
    pt: "Tema sobre música, artistas e gêneros musicais.",
    es: "Tema sobre música, artistas y géneros musicales.",
    de: "Thema über Musik, Künstler und Musikgenres.",
  }),
  status: "active",
});

const FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("dbb0664ad4797c6cc79d5aee"),
  slug: "sports",
  label: createFakeLocalizedText({
    fr: "Sport",
    en: "Sports",
    it: "Sport",
    pt: "Esportes",
    es: "Deportes",
    de: "Sport",
  }),
  aliases: createFakeLocalizedTexts({
    fr: ["Football", "Jeux"],
    en: ["Football", "Games"],
    it: ["Calcio", "Giochi"],
    pt: ["Futebol", "Jogos"],
    es: ["Fútbol", "Juegos"],
    de: ["Fußball", "Spiele"],
  }),
  description: createFakeLocalizedText({
    fr: "Thème concernant les sports, compétitions et athlètes.",
    en: "Theme about sports, competitions and athletes.",
    it: "Tema sullo sport, competizioni e atleti.",
    pt: "Tema sobre esportes, competições e atletas.",
    es: "Tema sobre deportes, competiciones y atletas.",
    de: "Thema über Sport, Wettbewerbe und Athleten.",
  }),
  status: "archived",
});

const FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("cddb37b90e4f6b7ec27bc1ee"),
  slug: "history",
  label: createFakeLocalizedText({
    fr: "Histoire",
    en: "History",
    it: "Storia",
    pt: "História",
    es: "Historia",
    de: "Geschichte",
  }),
  aliases: createFakeLocalizedTexts({
    fr: ["Passé", "Chronologie"],
    en: ["Past", "Chronology"],
    it: ["Passato", "Cronologia"],
    pt: ["Passado", "Cronologia"],
    es: ["Pasado", "Cronología"],
    de: ["Vergangenheit", "Chronologie"],
  }),
  description: createFakeLocalizedText({
    fr: "Thème sur les événements historiques, personnages et périodes.",
    en: "Theme about historical events, figures and periods.",
    it: "Tema sugli eventi storici, personaggi e periodi.",
    pt: "Tema sobre eventos históricos, personagens e períodos.",
    es: "Tema sobre eventos históricos, figuras y períodos.",
    de: "Thema über historische Ereignisse, Persönlichkeiten und Epochen.",
  }),
  status: "active",
});

const FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("9adeceb41db80ab7ec49b457"),
  slug: "science",
  label: createFakeLocalizedText({
    fr: "Science",
    en: "Science",
    it: "Scienza",
    pt: "Ciência",
    es: "Ciencia",
    de: "Wissenschaft",
  }),
  aliases: createFakeLocalizedTexts({
    fr: ["Technologie", "Recherche"],
    en: ["Technology", "Research"],
    it: ["Tecnologia", "Ricerca"],
    pt: ["Tecnologia", "Pesquisa"],
    es: ["Tecnología", "Investigación"],
    de: ["Technologie", "Forschung"],
  }),
  description: createFakeLocalizedText({
    fr: "Thème couvrant les sciences, découvertes et innovations.",
    en: "Theme covering sciences, discoveries and innovations.",
    it: "Argomento che copre scienze, scoperte e innovazioni.",
    pt: "Tema que abrange ciências, descobertas e inovações.",
    es: "Tema que abarca ciencias, descubrimientos e innovaciones.",
    de: "Thema, das Wissenschaften, Entdeckungen und Innovationen abdeckt.",
  }),
  status: "active",
});

const FIVE_QUESTION_THEMES_FIXTURE_SET = [
  FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
] as const satisfies ReturnType<typeof createFakeQuestionThemeDocument>[];

export {
  FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SET,
};