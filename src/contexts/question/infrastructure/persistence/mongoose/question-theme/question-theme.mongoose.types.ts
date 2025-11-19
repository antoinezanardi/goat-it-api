import type { QuestionThemeMongooseSchema } from "@question/infrastructure/persistence/mongoose/question-theme/question-theme.mongoose.schema";

import type { HydratedDocument } from "mongoose";

type QuestionThemeMongooseDocument = HydratedDocument<QuestionThemeMongooseSchema>;

export type { QuestionThemeMongooseDocument };