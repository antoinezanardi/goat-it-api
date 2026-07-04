import { createFakeQuestionThemeDocument } from "@faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000001"),
  slug: "cinema",
  color: "#33A1FF",
  label: createFakeLocalizedText({
    en: "Cinema",
    fr: "Cinéma",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Movies", "Films"],
    fr: ["Films", "Ciné"],
  }),
  description: createFakeLocalizedText({
    en: "Theme about cinema, filmmaking techniques, directors, and iconic movies.",
    fr: "Thème concernant le cinéma, les techniques de réalisation, les réalisateurs et les films emblématiques.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000002"),
  slug: "music",
  color: "#FA2333",
  label: createFakeLocalizedText({
    en: "Music",
    fr: "Musique",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Songs", "Tunes"],
    fr: ["Chanson", "Son"],
  }),
  description: createFakeLocalizedText({
    en: "Theme about music genres, instruments, composers, and musical history.",
    fr: "Thème sur les genres musicaux, les instruments, les compositeurs et l'histoire de la musique.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000003"),
  slug: "science",
  color: "#00C853",
  label: createFakeLocalizedText({
    en: "Science",
    fr: "Science",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Research", "Discovery"],
    fr: ["Recherche", "Découverte"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering scientific discoveries, research methodologies, and technological innovations.",
    fr: "Thème couvrant les découvertes scientifiques, les méthodologies de recherche et les innovations technologiques.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000004"),
  slug: "history",
  color: "#FF5733",
  label: createFakeLocalizedText({
    en: "History",
    fr: "Histoire",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Past", "Chronology"],
    fr: ["Passé", "Chronologie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme about historical events, influential figures, civilizations, and significant periods.",
    fr: "Thème sur les événements historiques, les personnages influents, les civilisations et les périodes marquantes.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000005"),
  slug: "geography",
  color: "#2962FF",
  label: createFakeLocalizedText({
    en: "Geography",
    fr: "Géographie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Countries", "Landscapes"],
    fr: ["Pays", "Paysages"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering physical landscapes, political boundaries, climates, and human geography.",
    fr: "Thème couvrant les paysages physiques, les frontières politiques, les climats et la géographie humaine.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000006"),
  slug: "literature",
  color: "#AA00FF",
  label: createFakeLocalizedText({
    en: "Literature",
    fr: "Littérature",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Books", "Novels"],
    fr: ["Livres", "Romans"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering literary works, genres, authors, and literary movements worldwide.",
    fr: "Thème couvrant les œuvres littéraires, les genres, les auteurs et les mouvements littéraires dans le monde.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000007"),
  slug: "animals",
  color: "#FF6D00",
  label: createFakeLocalizedText({
    en: "Animals",
    fr: "Animaux",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Creatures", "Wildlife"],
    fr: ["Créatures", "Faune"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering the animal kingdom, species diversity, and wildlife habitats.",
    fr: "Thème couvrant le règne animal, la diversité des espèces et les habitats sauvages.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000008"),
  slug: "space",
  color: "#1A237E",
  label: createFakeLocalizedText({
    en: "Space",
    fr: "Espace",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Galaxy", "Cosmos"],
    fr: ["Galaxie", "Cosmos"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering space exploration, planets, galaxies, and the mysteries of the cosmos.",
    fr: "Thème couvrant l'exploration spatiale, les planètes, les galaxies et les mystères du cosmos.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000009"),
  slug: "art",
  color: "#E91E63",
  label: createFakeLocalizedText({
    en: "Art",
    fr: "Art",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Painting", "Sculpture"],
    fr: ["Peinture", "Sculpture"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering visual arts, art movements, and artistic expression throughout history.",
    fr: "Thème couvrant les arts visuels, les mouvements artistiques et l'expression artistique à travers l'histoire.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000000a"),
  slug: "food",
  color: "#FFAB00",
  label: createFakeLocalizedText({
    en: "Food",
    fr: "Nourriture",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Cuisine", "Recipes"],
    fr: ["Cuisine", "Recettes"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering global cuisines, culinary techniques, ingredients, and food culture.",
    fr: "Thème couvrant les cuisines du monde, les techniques culinaires, les ingrédients et la culture alimentaire.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000000b"),
  slug: "medicine",
  color: "#00ACC1",
  label: createFakeLocalizedText({
    en: "Medicine",
    fr: "Médecine",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Healthcare", "Treatment"],
    fr: ["Santé", "Traitement"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering medical science, diseases, treatments, and healthcare systems.",
    fr: "Thème couvrant la science médicale, les maladies, les traitements et les systèmes de santé.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000000c"),
  slug: "astronomy",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Astronomy",
    fr: "Astronomie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Stars", "Planets"],
    fr: ["Étoiles", "Planètes"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering celestial bodies, cosmic phenomena, and the exploration of the universe.",
    fr: "Thème couvrant les corps célestes, les phénomènes cosmiques et l'exploration de l'univers.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000000d"),
  slug: "biology",
  color: "#4CAF50",
  label: createFakeLocalizedText({
    en: "Biology",
    fr: "Biologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Organisms", "Cells"],
    fr: ["Organismes", "Cellules"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering living organisms, biological processes, genetics, and evolution.",
    fr: "Thème couvrant les organismes vivants, les processus biologiques, la génétique et l'évolution.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000000e"),
  slug: "chemistry",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Chemistry",
    fr: "Chimie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Elements", "Reactions"],
    fr: ["Éléments", "Réactions"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering chemical elements, molecular structures, and chemical reactions.",
    fr: "Thème couvrant les éléments chimiques, les structures moléculaires et les réactions chimiques.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000000f"),
  slug: "physics",
  color: "#3F51B5",
  label: createFakeLocalizedText({
    en: "Physics",
    fr: "Physique",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Forces", "Energy"],
    fr: ["Forces", "Énergie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering physical laws, forces, motion, energy, and the nature of matter.",
    fr: "Thème couvrant les lois physiques, les forces, le mouvement, l'énergie et la nature de la matière.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000010"),
  slug: "technology",
  color: "#00E5FF",
  label: createFakeLocalizedText({
    en: "Technology",
    fr: "Technologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Tech", "Innovation"],
    fr: ["Tech", "Innovation"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering technological advancements, digital tools, and modern innovations.",
    fr: "Thème couvrant les avancées technologiques, les outils numériques et les innovations modernes.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000011"),
  slug: "gaming",
  color: "#6200EA",
  label: createFakeLocalizedText({
    en: "Gaming",
    fr: "Jeux vidéo",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Video Games", "Esports"],
    fr: ["Jeux vidéo", "Esport"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering video games, gaming culture, and the gaming industry.",
    fr: "Thème couvrant les jeux vidéo, la culture du jeu et l'industrie du jeu vidéo.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000012"),
  slug: "poker",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Poker",
    fr: "Poker",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Card Games", "Texas Hold'em"],
    fr: ["Jeux de cartes", "Texas Hold'em"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering poker strategies, hands, and competitive card play.",
    fr: "Thème couvrant les stratégies de poker, les mains et le jeu de cartes compétitif.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000013"),
  slug: "meditation",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Meditation",
    fr: "Méditation",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Mindfulness", "Zen"],
    fr: ["Pleine conscience", "Zen"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering meditation techniques, mindfulness practices, and mental wellness.",
    fr: "Thème couvrant les techniques de méditation, les pratiques de pleine conscience et le bien-être mental.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000014"),
  slug: "fitness",
  color: "#76FF03",
  label: createFakeLocalizedText({
    en: "Fitness",
    fr: "Fitness",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Exercise", "Workout"],
    fr: ["Exercice", "Entraînement"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering physical fitness, exercise routines, and health training.",
    fr: "Thème couvrant la condition physique, les routines d'exercice et l'entraînement sportif.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000015"),
  slug: "nutrition",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Nutrition",
    fr: "Nutrition",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Diet", "Healthy Eating"],
    fr: ["Régime", "Alimentation saine"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering nutritional science, dietary patterns, and food health.",
    fr: "Thème couvrant la science nutritionnelle, les habitudes alimentaires et l'alimentation santé.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000016"),
  slug: "cryptography",
  color: "#212121",
  label: createFakeLocalizedText({
    en: "Cryptography",
    fr: "Cryptographie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Encryption", "Ciphers"],
    fr: ["Chiffrement", "Cryptanalyse"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering encryption methods, cryptanalysis, and secure communication.",
    fr: "Thème couvrant les méthodes de chiffrement, la cryptanalyse et la communication sécurisée.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000017"),
  slug: "robotics",
  color: "#607D8B",
  label: createFakeLocalizedText({
    en: "Robotics",
    fr: "Robotique",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Automation", "Drones"],
    fr: ["Automatisation", "Drones"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering robot design, autonomous systems, and robotic technology.",
    fr: "Thème couvrant la conception de robots, les systèmes autonomes et la technologie robotique.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000018"),
  slug: "coffee",
  color: "#795548",
  label: createFakeLocalizedText({
    en: "Coffee",
    fr: "Café",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Brewing", "Espresso"],
    fr: ["Caféine", "Espresso"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering coffee culture, brewing methods, and bean varieties.",
    fr: "Thème couvrant la culture du café, les méthodes d'infusion et les variétés de grains.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000019"),
  slug: "chocolate",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Chocolate",
    fr: "Chocolat",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Cocoa", "Confectionery"],
    fr: ["Cacao", "Confiserie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering chocolate making, cacao history, and confectionery arts.",
    fr: "Thème couvrant la fabrication du chocolat, l'histoire du cacao et l'art de la confiserie.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000001a"),
  slug: "cars",
  color: "#D50000",
  label: createFakeLocalizedText({
    en: "Cars",
    fr: "Voitures",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Automobiles", "Vehicles"],
    fr: ["Automobiles", "Véhicules"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering automobiles, car history, and automotive engineering.",
    fr: "Thème couvrant les automobiles, l'histoire de l'automobile et l'ingénierie automobile.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000001b"),
  slug: "comics",
  color: "#FF1744",
  label: createFakeLocalizedText({
    en: "Comics",
    fr: "BD",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Graphic Novels", "Superheroes"],
    fr: ["Romans graphiques", "Super-héros"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering comic books, graphic novels, and sequential art.",
    fr: "Thème couvrant les bandes dessinées, les romans graphiques et l'art séquentiel.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000001c"),
  slug: "aviation",
  color: "#40C4FF",
  label: createFakeLocalizedText({
    en: "Aviation",
    fr: "Aviation",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Aeronautics", "Flight"],
    fr: ["Aéronautique", "Vol"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering aviation, aircraft, and the history of flight.",
    fr: "Thème couvrant l'aviation, les aéronefs et l'histoire du vol.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000001d"),
  slug: "maritime",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Maritime",
    fr: "Maritime",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Navigation", "Ocean"],
    fr: ["Navigation", "Océan"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering the maritime world, navigation, and oceans.",
    fr: "Thème couvrant le monde maritime, la navigation et les océans.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000001e"),
  slug: "wine",
  color: "#B71C1C",
  label: createFakeLocalizedText({
    en: "Wine",
    fr: "Vin",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Viticulture", "Oenology"],
    fr: ["Viticulture", "Œnologie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering wine, viticulture, and oenology.",
    fr: "Thème couvrant le vin, la viticulture et l'œnologie.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000001f"),
  slug: "beer",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Beer",
    fr: "Bière",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Brewing", "Hops"],
    fr: ["Brasserie", "Houblon"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering beer, breweries, and beer varieties.",
    fr: "Thème couvrant la bière, les brasseries et les types de bières.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000020"),
  slug: "tea",
  color: "#A5D6A7",
  label: createFakeLocalizedText({
    en: "Tea",
    fr: "Thé",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Infusion", "Teapot"],
    fr: ["Infusion", "Théière"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering tea, tea ceremonies, and tea varieties.",
    fr: "Thème couvrant le thé, les cérémonies du thé et les variétés.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000021"),
  slug: "gardening",
  color: "#2E7D32",
  label: createFakeLocalizedText({
    en: "Gardening",
    fr: "Jardinage",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Horticulture", "Plants"],
    fr: ["Horticulture", "Plantes"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering gardening, horticulture, and garden design.",
    fr: "Thème couvrant le jardinage, l'horticulture et l'art des jardins.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000022"),
  slug: "dance",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Dance",
    fr: "Danse",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Ballet", "Choreography"],
    fr: ["Ballet", "Chorégraphie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering dance, dance styles, and choreography.",
    fr: "Thème couvrant la danse, les styles de danse et la chorégraphie.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000023"),
  slug: "theater",
  color: "#FFC107",
  label: createFakeLocalizedText({
    en: "Theater",
    fr: "Théâtre",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Performance", "Comedy"],
    fr: ["Spectacle", "Comédie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering theater, plays, and performing arts.",
    fr: "Thème couvrant le théâtre, les pièces et les arts de la scène.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000024"),
  slug: "fashion",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Fashion",
    fr: "Mode",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Clothing", "Couture"],
    fr: ["Vêtements", "Couture"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering fashion, clothing, and the textile industry.",
    fr: "Thème couvrant la mode, les vêtements et l'industrie textile.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000025"),
  slug: "architecture",
  color: "#8D6E63",
  label: createFakeLocalizedText({
    en: "Architecture",
    fr: "Architecture",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Buildings", "Design"],
    fr: ["Bâtiments", "Design"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering architecture, buildings, and urban planning.",
    fr: "Thème couvrant l'architecture, les bâtiments et l'urbanisme.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000026"),
  slug: "politics",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Politics",
    fr: "Politique",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Government", "Elections"],
    fr: ["Gouvernement", "Élections"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering political systems, ideologies, governance, and international relations.",
    fr: "Thème couvrant les systèmes politiques, les idéologies, la gouvernance et les relations internationales.",
  }),
  status: "archived",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ECONOMICS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000027"),
  slug: "economics",
  color: "#FFD600",
  label: createFakeLocalizedText({
    en: "Economics",
    fr: "Économie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Finance", "Trade"],
    fr: ["Finance", "Commerce"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering economic systems, markets, trade, and financial theories.",
    fr: "Thème couvrant les systèmes économiques, les marchés, le commerce et les théories financières.",
  }),
  status: "archived",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000028"),
  slug: "philosophy",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Philosophy",
    fr: "Philosophie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Wisdom", "Ethics"],
    fr: ["Sagesse", "Éthique"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering philosophical ideas, thinkers, ethics, logic, and schools of thought.",
    fr: "Thème couvrant les idées philosophiques, les penseurs, l'éthique, la logique et les écoles de pensée.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000029"),
  slug: "psychology",
  color: "#9C27B0",
  label: createFakeLocalizedText({
    en: "Psychology",
    fr: "Psychologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Mind", "Behavior"],
    fr: ["Esprit", "Comportement"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering human behavior, mental processes, cognition, and psychological theories.",
    fr: "Thème couvrant le comportement humain, les processus mentaux, la cognition et les théories psychologiques.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000002a"),
  slug: "sociology",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Sociology",
    fr: "Sociologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Society", "Culture"],
    fr: ["Société", "Culture"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering social structures, group behavior, cultural norms, and societal changes.",
    fr: "Thème couvrant les structures sociales, le comportement de groupe, les normes culturelles et les changements sociétaux.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000002b"),
  slug: "anthropology",
  color: "#F4511E",
  label: createFakeLocalizedText({
    en: "Anthropology",
    fr: "Anthropologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Culture", "Evolution"],
    fr: ["Culture", "Évolution"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering human societies, cultural evolution, and anthropological research.",
    fr: "Thème couvrant les sociétés humaines, l'évolution culturelle et la recherche anthropologique.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ARCHAEOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000002c"),
  slug: "archaeology",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Archaeology",
    fr: "Archéologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Excavation", "Artifacts"],
    fr: ["Fouilles", "Artéfacts"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering archaeological digs, ancient civilizations, and material culture.",
    fr: "Thème couvrant les fouilles archéologiques, les civilisations anciennes et la culture matérielle.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_LINGUISTICS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000002d"),
  slug: "linguistics",
  color: "#009688",
  label: createFakeLocalizedText({
    en: "Linguistics",
    fr: "Linguistique",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Languages", "Grammar"],
    fr: ["Langues", "Grammaire"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering language structure, phonetics, syntax, and linguistic theory.",
    fr: "Thème couvrant la structure des langues, la phonétique, la syntaxe et la théorie linguistique.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000002e"),
  slug: "mythology",
  color: "#E040FB",
  label: createFakeLocalizedText({
    en: "Mythology",
    fr: "Mythologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Legends", "Deities"],
    fr: ["Légendes", "Divinités"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering myths, legends, deities, and mythological traditions across cultures.",
    fr: "Thème couvrant les mythes, légendes, divinités et traditions mythologiques à travers les cultures.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000002f"),
  slug: "military",
  color: "#4E342E",
  label: createFakeLocalizedText({
    en: "Military",
    fr: "Militaire",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Armed Forces", "Defense"],
    fr: ["Forces Armées", "Défense"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering armed forces, military history, strategy, and defense systems.",
    fr: "Thème couvrant les forces armées, l'histoire militaire, la stratégie et les systèmes de défense.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000030"),
  slug: "religion",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Religion",
    fr: "Religion",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Faith", "Beliefs"],
    fr: ["Foi", "Croyances"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering world religions, belief systems, rituals, and spiritual practices.",
    fr: "Thème couvrant les religions du monde, les systèmes de croyance, les rituels et les pratiques spirituelles.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000031"),
  slug: "mathematics",
  color: "#1B5E20",
  label: createFakeLocalizedText({
    en: "Mathematics",
    fr: "Mathématiques",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Algebra", "Geometry"],
    fr: ["Algèbre", "Géométrie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering mathematical theories, equations, proofs, and numerical concepts.",
    fr: "Thème couvrant les théories mathématiques, les équations, les preuves et les concepts numériques.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000032"),
  slug: "yoga",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Yoga",
    fr: "Yoga",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Asanas", "Pranayama"],
    fr: ["Postures", "Respiration"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering yoga practices, postures, breathing techniques, and meditation.",
    fr: "Thème couvrant les pratiques de yoga, les postures, les techniques de respiration et la méditation.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000033"),
  slug: "travel",
  color: "#0288D1",
  label: createFakeLocalizedText({
    en: "Travel",
    fr: "Voyage",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Tourism", "Adventure"],
    fr: ["Tourisme", "Aventure"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering travel destinations, cultures, tourism, and exploration.",
    fr: "Thème couvrant les destinations de voyage, les cultures, le tourisme et l'exploration.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000034"),
  slug: "climate",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Climate",
    fr: "Climat",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Weather", "Global Warming"],
    fr: ["Météo", "Réchauffement"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering climate systems, weather patterns, and climate change science.",
    fr: "Thème couvrant les systèmes climatiques, les schémas météorologiques et la science du changement climatique.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000035"),
  slug: "ecology",
  color: "#33691E",
  label: createFakeLocalizedText({
    en: "Ecology",
    fr: "Écologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Environment", "Conservation"],
    fr: ["Environnement", "Conservation"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering ecosystems, biodiversity, conservation, and environmental science.",
    fr: "Thème couvrant les écosystèmes, la biodiversité, la conservation et la science environnementale.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000036"),
  slug: "energy",
  color: "#FFD600",
  label: createFakeLocalizedText({
    en: "Energy",
    fr: "Énergie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Power", "Renewables"],
    fr: ["Puissance", "Renouvelables"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering energy sources, power generation, and sustainable technologies.",
    fr: "Thème couvrant les sources d'énergie, la production d'électricité et les technologies durables.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000037"),
  slug: "paleontology",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Paleontology",
    fr: "Paléontologie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Fossils", "Dinosaurs"],
    fr: ["Fossiles", "Dinosaures"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering fossils, prehistoric life, dinosaurs, and geological time periods.",
    fr: "Thème couvrant les fossiles, la vie préhistorique, les dinosaures et les périodes géologiques.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000038"),
  slug: "chess",
  color: "#455A64",
  label: createFakeLocalizedText({
    en: "Chess",
    fr: "Échecs",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Chessboard", "Openings"],
    fr: ["Échiquier", "Ouvertures"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering chess strategies, openings, endgames, and famous players.",
    fr: "Thème couvrant les stratégies d'échecs, les ouvertures, les finales et les joueurs célèbres.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("600000000000000000000039"),
  slug: "photography",
  color: "#37474F",
  label: createFakeLocalizedText({
    en: "Photography",
    fr: "Photographie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Camera", "Portrait"],
    fr: ["Appareil Photo", "Portrait"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering photography techniques, camera equipment, and visual composition.",
    fr: "Thème couvrant les techniques photographiques, le matériel et la composition visuelle.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000003a"),
  slug: "anime",
  color: "#FF4081",
  label: createFakeLocalizedText({
    en: "Anime",
    fr: "Anime",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Manga", "Japanese Animation"],
    fr: ["Manga", "Animation Japonaise"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering anime series, films, genres, and Japanese animation culture.",
    fr: "Thème couvrant les séries animées, les films, les genres et la culture de l'animation japonaise.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000003b"),
  slug: "magic",
  color: "#7C4DFF",
  label: createFakeLocalizedText({
    en: "Magic",
    fr: "Magie",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Illusion", "Sorcery"],
    fr: ["Illusion", "Sorcellerie"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering magic tricks, illusionism, stage magic, and the history of conjuring.",
    fr: "Thème couvrant les tours de magie, l'illusionnisme, la magie de scène et l'histoire de la prestidigitation.",
  }),
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("60000000000000000000003c"),
  slug: "sports",
  color: undefined,
  label: createFakeLocalizedText({
    en: "Sports",
    fr: "Sports",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Competition", "Games"],
    fr: ["Compétition", "Jeux"],
  }),
  description: createFakeLocalizedText({
    en: "Theme covering athletic competitions, sports disciplines, teams, and sporting history.",
    fr: "Thème couvrant les compétitions sportives, les disciplines, les équipes et l'histoire du sport.",
  }),
  status: "archived",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
});

const SIXTY_QUESTION_THEMES_FIXTURE_SET = [
  SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECONOMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHAEOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LINGUISTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
] as const satisfies ReturnType<typeof createFakeQuestionThemeDocument>[];

export {
  SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECONOMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHAEOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LINGUISTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SET,
};