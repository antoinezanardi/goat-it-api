import type { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";
import type { HydratedDocument } from "mongoose";

import type { MongooseCollectionSchemaBase } from "@shared/infrastructure/persistence/mongoose/types/mongoose.types";

type QuestionThemeMongooseDocument = HydratedDocument<QuestionThemeMongooseSchema>;

type QuestionThemeMongooseSchemaShape = QuestionThemeMongooseSchema & MongooseCollectionSchemaBase;

type QuestionThemeStatsAggregationResult = {
  total: { count: number }[];
  statusRows: Record<string, number>[];
  byQuestionCount: { themeId: string; themeSlug: string; activeQuestionCount: number }[];
};

export type {
  QuestionThemeMongooseDocument,
  QuestionThemeMongooseSchemaShape,
  QuestionThemeStatsAggregationResult,
};