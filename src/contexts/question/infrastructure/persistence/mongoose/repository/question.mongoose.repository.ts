import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { shake } from "radashi";

import { addArrayFilterIfNonEmpty, buildMongooseAggregationSortStages, getCrushedDataForMongoPatchUpdate, getDefinedFieldsForMongoArrayElementUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
import { buildIsFullyTranslatedForLocaleMatchCondition } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";
import { hasLimit } from "@shared/domain/rules/limit/limit.rules";

import { shuffleArray } from "@question/infrastructure/persistence/mongoose/repository/helpers/array.helpers";
import { buildIsApplicableForLocaleMatchCondition, buildQuestionAggregationFilterStages } from "@question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers";
import { QUESTION_SEMANTIC_SORT_ORDERS, QUESTION_TRANSLATION_COMPLETENESS_FIELD_SPECS } from "@question/infrastructure/persistence/mongoose/constants/question.mongoose.constants";
import { QUESTION_STATUS_ACTIVE, QUESTION_STATUS_ARCHIVED, QUESTION_STATUS_PENDING, QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS, QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/constants/question.constants";
import { QUESTION_THEME_USAGE_PERSISTENCE_FIELDS } from "@question/contracts/persistence/question.persistence.contracts.constants";
import { createQuestionFromAggregate, createQuestionMongooseInsertPayloadFromContract, createQuestionThemeAssignmentMongooseInsertPayloadFromContract } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { QUESTION_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline";
import { QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question-stats/question-stats.mongoose.repository.pipeline";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import type { Question } from "@question/domain/types/question.entities";

import type { Model, QueryFilter, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";

import type { QuestionCreationContract, QuestionModificationContract, QuestionThemeAssignmentCreationContract, QuestionThemeAssignmentModificationContract } from "@question/domain/repositories/question.repository-contracts.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import type { QuestionFilterOptions, QuestionSortableField, FindRandomQuestionsOptions, QuestionStats } from "@question/domain/types/question.types";
import type { QuestionAggregate, QuestionMongooseDocument, QuestionStatsAggregationResult, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

/**
 * Mongoose adapter for `QuestionRepository`.
 *
 * Every read aggregates the question together with its theme assignments, resolved through a `$lookup` and ordered primary first.
 *
 * Theme assignment writes are conditional updates: the filter enforces the duplicate, count and primary guards, so a lost race cannot persist an invalid assignment.
 */
@Injectable()
export class QuestionMongooseRepository implements QuestionRepository {
  public constructor(@InjectModel(QuestionMongooseSchema.name) private readonly questionModel: Model<QuestionMongooseDocument>) {}

  private static composeFindRandomMatchStage(options: FindRandomQuestionsOptions): Record<string, unknown> {
    const matchStage: Record<string, unknown> = { status: QUESTION_STATUS_ACTIVE };

    addArrayFilterIfNonEmpty(options.excludedIds, matchStage, "_id", ids => ({ $nin: ids.map(id => new Types.ObjectId(id)) }));
    addArrayFilterIfNonEmpty(options.categories, matchStage, "category", categories => ({ $in: categories }));
    addArrayFilterIfNonEmpty(options.cognitiveDifficulties, matchStage, "cognitiveDifficulty", difficulties => ({ $in: difficulties }));
    addArrayFilterIfNonEmpty(options.themeIds, matchStage, "themes.themeId", ids => ({ $in: ids.map(id => new Types.ObjectId(id)) }));
    Object.assign(matchStage, shake({ isAdultContent: options.isAdultContent }));
    Object.assign(
      matchStage,
      buildIsApplicableForLocaleMatchCondition(options.locale),
      buildIsFullyTranslatedForLocaleMatchCondition(QUESTION_TRANSLATION_COMPLETENESS_FIELD_SPECS, options.locale),
    );

    return matchStage;
  }

  private static composeQuestionThemeAssignmentPushFilter(questionId: string, themeId: Types.ObjectId): QueryFilter<QuestionMongooseDocument> {
    return {
      _id: new Types.ObjectId(questionId),
      [QUESTION_THEME_USAGE_PERSISTENCE_FIELDS.themeId]: { $ne: themeId },
      $expr: { $lt: [{ $size: "$themes" }, QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS] },
    };
  }

  private static composeQuestionThemeAssignmentRemovalFilter(questionId: string, themeId: Types.ObjectId): QueryFilter<QuestionMongooseDocument> {
    return {
      _id: new Types.ObjectId(questionId),
      themes: { $elemMatch: { themeId, isPrimary: false } },
      [`themes.${QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS}`]: { $exists: true },
    };
  }

  private static composeQuestionThemeAssignmentModificationFilter(questionId: string, themeId: string): QueryFilter<QuestionMongooseDocument> {
    return {
      _id: new Types.ObjectId(questionId),
      [QUESTION_THEME_USAGE_PERSISTENCE_FIELDS.themeId]: new Types.ObjectId(themeId),
    };
  }

  private static composeQuestionThemeAssignmentPrimaryPushPipeline(insertPayload: QuestionThemeAssignmentMongooseInsertPayload): UpdateWithAggregationPipeline {
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

  private static composeQuestionThemeAssignmentPrimaryPromotionPipeline(themeId: string, contract: QuestionThemeAssignmentModificationContract): UpdateWithAggregationPipeline {
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

  /**
   * Applies the filters, joins the theme assignments, then sorts and limits in one aggregation, so theme data is read in the same round trip.
   *
   * `limit` is applied last: a missing or `0` limit returns the full filtered set.
   */
  public async findAll(options: FindAllOptions<QuestionSortableField, QuestionFilterOptions>): Promise<Question[]> {
    const filterStages = buildQuestionAggregationFilterStages(options.filters);
    const sortStages = buildMongooseAggregationSortStages(options.sort, QUESTION_SEMANTIC_SORT_ORDERS);
    const limitStage = hasLimit(options.limit) ? [{ $limit: options.limit }] : [];
    const questionWithThemes = await this.questionModel.aggregate<QuestionAggregate>([
      ...filterStages,
      ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ...sortStages,
      ...limitStage,
    ]);

    return questionWithThemes.map(createQuestionFromAggregate);
  }

  /**
   * Returns `undefined` when no document matches the id; unlike `FindQuestionByIdUseCase`, it does not throw.
   */
  public async findById(id: string): Promise<Question | undefined> {
    const questions = await this.questionModel.aggregate<QuestionAggregate>([
      { $match: { _id: new Types.ObjectId(id) } },
      ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
    ]);

    if (questions.length === 0) {
      return undefined;
    }
    return createQuestionFromAggregate(questions[0]);
  }

  /**
   * Inserts the document, then re-reads it through the aggregation, so the result carries the theme assignments or is `undefined` when the read-back fails.
   */
  public async create(questionCreationContract: QuestionCreationContract): Promise<Question | undefined> {
    const questionCreationDocument = createQuestionMongooseInsertPayloadFromContract(questionCreationContract);
    const createdQuestionDocument = await this.questionModel.create(questionCreationDocument);

    return this.findById(createdQuestionDocument._id.toString());
  }

  /**
   * Sets the archived status and returns the re-read question, or `undefined` when the question does not exist.
   */
  public async archive(id: string): Promise<Question | undefined> {
    const update: UpdateQuery<QuestionMongooseDocument> = {
      status: QUESTION_STATUS_ARCHIVED,
    };
    await this.questionModel.findByIdAndUpdate(id, update);

    return this.findById(id);
  }

  /**
   * Appends the assignment only when the question exists, the theme is not already assigned and the question holds fewer than
   * `QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS` assignments. A primary assignment demotes the current primary theme in the same atomic
   * update pipeline, so a reader never observes zero or two primary themes.
   *
   * Returns `undefined` when the conditional write matches no document.
   */
  public async assignTheme(questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract): Promise<Question | undefined> {
    const insertPayload = createQuestionThemeAssignmentMongooseInsertPayloadFromContract(questionThemeAssignmentCreationContract);
    const updateResult = questionThemeAssignmentCreationContract.isPrimary ? await this.questionModel.updateOne(
      QuestionMongooseRepository.composeQuestionThemeAssignmentPushFilter(questionId, insertPayload.themeId),
      QuestionMongooseRepository.composeQuestionThemeAssignmentPrimaryPushPipeline(insertPayload),
      { updatePipeline: true },
    ) : await this.questionModel.updateOne(
      QuestionMongooseRepository.composeQuestionThemeAssignmentPushFilter(questionId, insertPayload.themeId),
      { $push: { themes: insertPayload } },
    );

    if (updateResult.matchedCount === 0) {
      return undefined;
    }
    return this.findById(questionId);
  }

  /**
   * Updates an existing assignment. A primary promotion demotes every other assignment in the same atomic pipeline, and a non-primary update writes only the defined fields.
   *
   * Returns `undefined` when the conditional write matches no document.
   */
  public async modifyThemeAssignment(questionId: string, themeId: string, contract: QuestionThemeAssignmentModificationContract): Promise<Question | undefined> {
    if (contract.isPrimary) {
      const updateResult = await this.questionModel.updateOne(
        QuestionMongooseRepository.composeQuestionThemeAssignmentModificationFilter(questionId, themeId),
        QuestionMongooseRepository.composeQuestionThemeAssignmentPrimaryPromotionPipeline(themeId, contract),
        { updatePipeline: true },
      );

      if (updateResult.matchedCount === 0) {
        return undefined;
      }
      return this.findById(questionId);
    }
    const fieldsToSet = getDefinedFieldsForMongoArrayElementUpdate(contract, "themes.$[elem]");
    if (Object.keys(fieldsToSet).length === 0) {
      return this.findById(questionId);
    }
    const themeObjectId = new Types.ObjectId(themeId);
    const updateResult = await this.questionModel.updateOne(
      QuestionMongooseRepository.composeQuestionThemeAssignmentModificationFilter(questionId, themeId),
      { $set: fieldsToSet },
      { arrayFilters: [{ "elem.themeId": themeObjectId }] },
    );

    if (updateResult.matchedCount === 0) {
      return undefined;
    }
    return this.findById(questionId);
  }

  /**
   * Applies only the fields present in the contract as a `$set` patch, then returns the re-read question.
   */
  public async modify(id: string, contract: QuestionModificationContract): Promise<Question | undefined> {
    const questionUpdateData = getCrushedDataForMongoPatchUpdate(contract);
    const updateQuery: UpdateQuery<QuestionMongooseDocument> = { $set: questionUpdateData };
    await this.questionModel.findByIdAndUpdate(id, updateQuery);

    return this.findById(id);
  }

  /**
   * Pulls the assignment only when the question exists, still holds more than `QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS` assignments
   * and the target assignment exists and is not primary.
   *
   * Returns `undefined` when the conditional write matches no document.
   */
  public async removeTheme(questionId: string, themeId: string): Promise<Question | undefined> {
    const themeObjectId = new Types.ObjectId(themeId);
    const updateResult = await this.questionModel.updateOne(
      QuestionMongooseRepository.composeQuestionThemeAssignmentRemovalFilter(questionId, themeObjectId),
      { $pull: { themes: { themeId: themeObjectId } } },
    );

    if (updateResult.matchedCount === 0) {
      return undefined;
    }
    return this.findById(questionId);
  }

  public async countLiveByThemeId(themeId: string): Promise<number> {
    return this.questionModel.countDocuments({
      themes: {
        $elemMatch: {
          themeId: new Types.ObjectId(themeId),
        },
      },
      status: {
        $in: [
          QUESTION_STATUS_PENDING,
          QUESTION_STATUS_ACTIVE,
        ],
      },
    });
  }

  /**
   * Samples up to `options.limit` active questions with `$sample`, then shuffles them again in memory, so the returned order is
   * not the database order and is not stable between calls.
   */
  public async findRandom(options: FindRandomQuestionsOptions): Promise<Question[]> {
    const matchStage = QuestionMongooseRepository.composeFindRandomMatchStage(options);

    const questionWithThemes = await this.questionModel.aggregate<QuestionAggregate>([
      { $match: matchStage },
      { $sample: { size: options.limit } },
      ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
    ]);

    return shuffleArray(questionWithThemes.map(createQuestionFromAggregate));
  }

  /**
   * Returns the aggregation counts with zero fallbacks, so a missing row yields `0` or an empty breakdown instead of `undefined`.
   */
  public async getStats(): Promise<QuestionStats> {
    const [result] = await this.questionModel.aggregate<QuestionStatsAggregationResult>(QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE);

    return {
      total: result.totalStage[0]?.count ?? 0,
      byStatus: result.byStatusStage[0] ?? {},
      byCategory: result.byCategoryStage[0] ?? {},
      byCognitiveDifficulty: result.byCognitiveDifficultyStage[0] ?? {},
      byAuthorRole: result.byAuthorRoleStage[0] ?? {},
      byRejectionType: result.byRejectionTypeStage[0] ?? {},
      byTranslationCompleteness: {
        fullyTranslated: result.fullyTranslatedCountStage[0]?.count ?? 0,
        incomplete: result.incompleteTranslationCountStage[0]?.count ?? 0,
      },
    };
  }
}