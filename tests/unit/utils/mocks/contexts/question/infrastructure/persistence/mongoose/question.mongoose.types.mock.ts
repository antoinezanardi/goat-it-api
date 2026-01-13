import type { MongooseDocumentStub } from "@mocks/infrastructure/database/database.types.mock";

import type { QuestionMongooseDocument } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

type QuestionMongooseDocumentStub = MongooseDocumentStub<QuestionMongooseDocument>;

type QuestionThemeAssignmentMongooseDocumentStub = QuestionMongooseDocumentStub["themes"][number];

export type {
  QuestionMongooseDocumentStub,
  QuestionThemeAssignmentMongooseDocumentStub,
};