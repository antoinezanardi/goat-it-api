import type { MongooseDocumentStub } from "@mocks/infrastructure/database/database.types.mock";

import type { QuestionThemeMongooseDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

type QuestionThemeMongooseDocumentStub = MongooseDocumentStub<QuestionThemeMongooseDocument>;

export type { QuestionThemeMongooseDocumentStub };