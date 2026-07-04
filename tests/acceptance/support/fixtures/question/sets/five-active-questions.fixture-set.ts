import { createFakeQuestionDocument, createFakeQuestionThemeAssignmentDocument } from "@faketories/contexts/question/mongoose/mongoose-document/question.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

import {
  FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
} from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

const FIVE_ACTIVE_QUESTIONS_FIXTURE_SET = [
  createFakeQuestionDocument({
    _id: createFakeObjectId("f1a2b3c4d5e6012345678901"),
    status: "active",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    createdAt: new Date("2024-05-01T00:00:00.000Z"),
    updatedAt: new Date("2024-05-01T00:00:00.000Z"),
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("f2a3b4c5d6e7012345678902"),
    status: "active",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    createdAt: new Date("2024-04-01T00:00:00.000Z"),
    updatedAt: new Date("2024-04-01T00:00:00.000Z"),
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("f3a4b5c6d7e8012345678903"),
    status: "active",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    createdAt: new Date("2024-03-01T00:00:00.000Z"),
    updatedAt: new Date("2024-03-01T00:00:00.000Z"),
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("f4a5b6c7d8e9012345678904"),
    status: "active",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    createdAt: new Date("2024-02-01T00:00:00.000Z"),
    updatedAt: new Date("2024-02-01T00:00:00.000Z"),
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("f5a6b7c8d9ea012345678905"),
    status: "active",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  }),
] as const satisfies ReturnType<typeof createFakeQuestionDocument>[];

export { FIVE_ACTIVE_QUESTIONS_FIXTURE_SET };