import type { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

import type { HydratedDocument, Model } from "mongoose";

import type { QuestionThemeMongooseSchemaShape } from "@question/modules/question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";
import type { MongooseCollectionSchemaBase } from "@shared/infrastructure/persistence/mongoose/mongoose.types";

type QuestionMongooseDocument = HydratedDocument<QuestionMongooseSchema>;

type QuestionAggregatePipeline = Parameters<Model<QuestionMongooseDocument>["aggregate"]>[0];

type QuestionMongooseSchemaShape = QuestionMongooseSchema & MongooseCollectionSchemaBase;

type QuestionThemeAssignmentAggregate = Omit<
  QuestionMongooseSchemaShape["themes"][number],
  "themeId"
> & {
  theme: QuestionThemeMongooseSchemaShape;
};

type QuestionAggregate = Omit<
  QuestionMongooseSchemaShape,
  "themes"
> & {
  themes: QuestionThemeAssignmentAggregate[];
};

export type {
  QuestionMongooseDocument,
  QuestionAggregatePipeline,
  QuestionThemeAssignmentAggregate,
  QuestionAggregate,
};