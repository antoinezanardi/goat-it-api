import type { QuestionThemeMongooseSchema } from "@question/modules/question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

import type { HydratedDocument } from "mongoose";

import type { MongooseCollectionSchemaBase } from "@shared/infrastructure/persistence/mongoose/mongoose.types";

type QuestionThemeMongooseDocument = HydratedDocument<QuestionThemeMongooseSchema>;

type QuestionThemeMongooseSchemaShape = QuestionThemeMongooseSchema & MongooseCollectionSchemaBase;

export type {
  QuestionThemeMongooseDocument,
  QuestionThemeMongooseSchemaShape,
};