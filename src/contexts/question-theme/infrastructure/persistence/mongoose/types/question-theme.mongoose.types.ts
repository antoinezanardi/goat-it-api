import type { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";
import type { HydratedDocument, Types } from "mongoose";

import type { MongooseCollectionSchemaBase } from "@shared/infrastructure/persistence/mongoose/types/mongoose.types";

type QuestionThemeMongooseDocument = HydratedDocument<QuestionThemeMongooseSchema>;

type QuestionThemeMongooseSchemaShape = QuestionThemeMongooseSchema & MongooseCollectionSchemaBase;

type QuestionThemeFacetAggregationResult = {
  total: { count: number }[];
  statusRows: { _id: string; count: number }[];
};

type QuestionCountAggregationRow = {
  _id: Types.ObjectId;
  count: number;
};

type QuestionThemeLeanProjection = {
  _id: Types.ObjectId;
  slug: string;
};

export type {
  QuestionThemeMongooseDocument,
  QuestionThemeMongooseSchemaShape,
  QuestionThemeFacetAggregationResult,
  QuestionCountAggregationRow,
  QuestionThemeLeanProjection,
};