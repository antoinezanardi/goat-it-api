import type { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

import type { HydratedDocument, Model } from "mongoose";
import type { QuestionThemePersistenceShape } from "@question-theme/contracts/persistence/question-theme.persistence.contracts";

import type { MongooseCollectionSchemaBase } from "@shared/infrastructure/persistence/mongoose/types/mongoose.types";

type QuestionMongooseDocument = HydratedDocument<QuestionMongooseSchema>;

type QuestionAggregatePipeline = Parameters<Model<QuestionMongooseDocument>["aggregate"]>[0];

type QuestionMongooseSchemaShape = QuestionMongooseSchema & MongooseCollectionSchemaBase;

type QuestionThemeAggregate = QuestionThemePersistenceShape;

type QuestionThemeAssignmentAggregate = Omit<
  QuestionMongooseSchemaShape["themes"][number],
  "themeId"
> & {
  theme: QuestionThemeAggregate;
};

type QuestionAggregate = Omit<
  QuestionMongooseSchemaShape,
  "themes"
> & {
  themes: QuestionThemeAssignmentAggregate[];
};

type QuestionMongooseInsertPayload = Parameters<Model<QuestionMongooseDocument>["create"]>[0];

type QuestionThemeAssignmentMongooseInsertPayload = QuestionMongooseDocument["themes"][number];

type QuestionStatsAggregationResult = {
  totalStage: { count: number }[];
  byStatusStage: Record<string, number>[];
  byCategoryStage: Record<string, number>[];
  byCognitiveDifficultyStage: Record<string, number>[];
  byAuthorRoleStage: Record<string, number>[];
  byRejectionTypeStage: Record<string, number>[];
  fullyTranslatedCountStage: { count: number }[];
  incompleteTranslationCountStage: { count: number }[];
};

export type {
  QuestionMongooseDocument,
  QuestionAggregatePipeline,
  QuestionThemeAggregate,
  QuestionThemeAssignmentAggregate,
  QuestionAggregate,
  QuestionMongooseInsertPayload,
  QuestionThemeAssignmentMongooseInsertPayload,
  QuestionStatsAggregationResult,
};