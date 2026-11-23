import { Types } from "mongoose";

import { QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS, QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/constants/question.constants";
import {
  composeQuestionThemeAssignmentModificationFilter,
  composeQuestionThemeAssignmentPrimaryPromotionPipeline,
  composeQuestionThemeAssignmentPrimaryPushPipeline,
  composeQuestionThemeAssignmentPushFilter,
  composeQuestionThemeAssignmentRemovalFilter,
} from "@question/infrastructure/persistence/mongoose/repository/helpers/question-theme-assignment.mongoose.helpers";

import { createFakeQuestionThemeAssignmentMongooseInsertPayload } from "@faketories/contexts/question/mongoose/mongoose-insert-payload/question.mongoose-insert-payload.faketory";

import type { QuestionThemeAssignmentModificationContract } from "@question/domain/repositories/question.repository-contracts.types";

describe(composeQuestionThemeAssignmentPushFilter, () => {
  it("should return the id, duplicate guard and ceiling conditions when called.", () => {
    const questionId = "618c1f4b3a2f000000000001";
    const themeObjectId = new Types.ObjectId("618c1f4b3a2f000000000002");

    const result = composeQuestionThemeAssignmentPushFilter(questionId, themeObjectId);

    expect(result).toStrictEqual({
      "_id": new Types.ObjectId(questionId),
      "themes.themeId": { $ne: themeObjectId },
      "$expr": { $lt: [{ $size: "$themes" }, QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS] },
    });
  });
});

describe(composeQuestionThemeAssignmentRemovalFilter, () => {
  it("should return the id, non-primary and floor conditions when called.", () => {
    const questionId = "618c1f4b3a2f000000000003";
    const themeObjectId = new Types.ObjectId("618c1f4b3a2f000000000004");

    const result = composeQuestionThemeAssignmentRemovalFilter(questionId, themeObjectId);

    expect(result).toStrictEqual({
      _id: new Types.ObjectId(questionId),
      themes: { $elemMatch: { themeId: themeObjectId, isPrimary: false } },
      [`themes.${QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS}`]: { $exists: true },
    });
  });
});

describe(composeQuestionThemeAssignmentModificationFilter, () => {
  it("should return the id and held theme assignment conditions when called.", () => {
    const questionId = "618c1f4b3a2f000000000005";
    const themeId = "618c1f4b3a2f000000000006";

    const result = composeQuestionThemeAssignmentModificationFilter(questionId, themeId);

    expect(result).toStrictEqual({
      "_id": new Types.ObjectId(questionId),
      "themes.themeId": new Types.ObjectId(themeId),
    });
  });
});

describe(composeQuestionThemeAssignmentPrimaryPushPipeline, () => {
  it("should return a single pipeline that demotes the current primary and appends the payload when called.", () => {
    const insertPayload = createFakeQuestionThemeAssignmentMongooseInsertPayload();

    const result = composeQuestionThemeAssignmentPrimaryPushPipeline(insertPayload);

    expect(result).toStrictEqual([
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
    ]);
  });
});

describe(composeQuestionThemeAssignmentPrimaryPromotionPipeline, () => {
  it("should not include isHint in the promotion when the contract omits isHint.", () => {
    const themeId = "618c1f4b3a2f000000000007";
    const contract: QuestionThemeAssignmentModificationContract = { isPrimary: true };

    const result = composeQuestionThemeAssignmentPrimaryPromotionPipeline(themeId, contract);

    expect(result).toStrictEqual([
      {
        $set: {
          themes: {
            $map: {
              input: "$themes",
              as: "themeAssignment",
              in: {
                $cond: [
                  { $eq: ["$$themeAssignment.themeId", new Types.ObjectId(themeId)] },
                  { $mergeObjects: ["$$themeAssignment", { isPrimary: true }] },
                  { $mergeObjects: ["$$themeAssignment", { isPrimary: false }] },
                ],
              },
            },
          },
        },
      },
    ]);
  });

  it("should include isHint in the promotion when the contract provides isHint.", () => {
    const themeId = "618c1f4b3a2f000000000008";
    const contract: QuestionThemeAssignmentModificationContract = { isPrimary: true, isHint: false };

    const result = composeQuestionThemeAssignmentPrimaryPromotionPipeline(themeId, contract);

    expect(result).toStrictEqual([
      {
        $set: {
          themes: {
            $map: {
              input: "$themes",
              as: "themeAssignment",
              in: {
                $cond: [
                  { $eq: ["$$themeAssignment.themeId", new Types.ObjectId(themeId)] },
                  { $mergeObjects: ["$$themeAssignment", { isPrimary: true, isHint: false }] },
                  { $mergeObjects: ["$$themeAssignment", { isPrimary: false }] },
                ],
              },
            },
          },
        },
      },
    ]);
  });
});