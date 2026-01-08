import type { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

import type { HydratedDocument } from "mongoose";

type QuestionMongooseDocument = HydratedDocument<QuestionMongooseSchema>;

export type { QuestionMongooseDocument };