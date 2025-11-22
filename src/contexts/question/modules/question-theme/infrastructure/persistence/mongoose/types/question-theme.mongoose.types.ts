import type { QuestionThemeMongooseSchema } from "@question/modules/question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

import type { HydratedDocument } from "mongoose";

type QuestionThemeMongooseDocument = HydratedDocument<QuestionThemeMongooseSchema>;

export type { QuestionThemeMongooseDocument };