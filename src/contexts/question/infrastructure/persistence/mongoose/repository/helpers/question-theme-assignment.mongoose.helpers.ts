import { Types } from "mongoose";

import { QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS, QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/constants/question.constants";
import { QUESTION_THEME_USAGE_PERSISTENCE_FIELDS } from "@question/contracts/persistence/question.persistence.contracts.constants";

import type { QueryFilter, UpdateWithAggregationPipeline } from "mongoose";

import type { QuestionThemeAssignmentModificationContract } from "@question/domain/repositories/question.repository-contracts.types";
import type { QuestionMongooseDocument, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

/**
 * Rejects the push unless the question exists, does not already hold the theme and stays below the `QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS` ceiling.
 */
function composeQuestionThemeAssignmentPushFilter(questionId: string, themeId: Types.ObjectId): QueryFilter<QuestionMongooseDocument> {
  return {
    _id: new Types.ObjectId(questionId),
    [QUESTION_THEME_USAGE_PERSISTENCE_FIELDS.themeId]: { $ne: themeId },
    $expr: { $lt: [{ $size: "$themes" }, QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS] },
  };
}

/**
 * Rejects the removal unless the question exists, keeps more than the `QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS` floor and the target assignment is not primary.
 */
function composeQuestionThemeAssignmentRemovalFilter(questionId: string, themeId: Types.ObjectId): QueryFilter<QuestionMongooseDocument> {
  return {
    _id: new Types.ObjectId(questionId),
    themes: { $elemMatch: { themeId, isPrimary: false } },
    [`themes.${QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS}`]: { $exists: true },
  };
}

/**
 * Restricts the write to the question that actually holds the target theme assignment.
 */
function composeQuestionThemeAssignmentModificationFilter(questionId: string, themeId: string): QueryFilter<QuestionMongooseDocument> {
  return {
    _id: new Types.ObjectId(questionId),
    [QUESTION_THEME_USAGE_PERSISTENCE_FIELDS.themeId]: new Types.ObjectId(themeId),
  };
}

/**
 * Demotes the current primary assignment while appending the new one in a single-document update pipeline that must be passed with `{ updatePipeline: true }` in Mongoose 9, so a reader never observes zero or two primary themes.
 */
function composeQuestionThemeAssignmentPrimaryPushPipeline(insertPayload: QuestionThemeAssignmentMongooseInsertPayload): UpdateWithAggregationPipeline {
  return [
    {
      $set: {
        themes: {
          $concatArrays: [
            {
              $map: {
                input: "$themes",
                as: "themeAssignment",
                in: { $mergeObjects: ["$$themeAssignment", { isPrimary: false }] },
              },
            },
            [insertPayload],
          ],
        },
      },
    },
  ];
}

/**
 * Promotes the target assignment and demotes every other one in a single-document update pipeline that must be passed with `{ updatePipeline: true }` in Mongoose 9, so primary exclusivity holds.
 */
function composeQuestionThemeAssignmentPrimaryPromotionPipeline(themeId: string, contract: QuestionThemeAssignmentModificationContract): UpdateWithAggregationPipeline {
  const promotionFields = contract.isHint === undefined ? { isPrimary: true } : { isPrimary: true, isHint: contract.isHint };

  return [
    {
      $set: {
        themes: {
          $map: {
            input: "$themes",
            as: "themeAssignment",
            in: {
              $cond: [
                { $eq: ["$$themeAssignment.themeId", new Types.ObjectId(themeId)] },
                { $mergeObjects: ["$$themeAssignment", promotionFields] },
                { $mergeObjects: ["$$themeAssignment", { isPrimary: false }] },
              ],
            },
          },
        },
      },
    },
  ];
}

export {
  composeQuestionThemeAssignmentPushFilter,
  composeQuestionThemeAssignmentRemovalFilter,
  composeQuestionThemeAssignmentModificationFilter,
  composeQuestionThemeAssignmentPrimaryPushPipeline,
  composeQuestionThemeAssignmentPrimaryPromotionPipeline,
};