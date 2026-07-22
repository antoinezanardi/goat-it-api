import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";

import { addArrayFilterIfNonEmpty, buildMongooseAggregationSortStages, getCrushedDataForMongoPatchUpdate, getDefinedFieldsForMongoArrayElementUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
import { hasLimit } from "@shared/domain/rules/limit/limit.rules";

import { buildQuestionAggregationFilterStages } from "@question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers";
import { QUESTION_SEMANTIC_SORT_ORDERS } from "@question/infrastructure/persistence/mongoose/constants/question.mongoose.constants";
import { QuestionCreationContract, QuestionModificationContract, QuestionThemeAssignmentCreationContract, QuestionThemeAssignmentModificationContract } from "@question/domain/types/question.contracts";
import { QUESTION_STATUS_ACTIVE, QUESTION_STATUS_ARCHIVED, QUESTION_STATUS_PENDING } from "@question/domain/constants/question.constants";
import { createQuestionFromAggregate, createQuestionMongooseInsertPayloadFromContract, createQuestionThemeAssignmentMongooseInsertPayloadFromContract } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { QUESTION_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline";
import { QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question-stats-pipeline/question-stats.mongoose.repository.pipeline";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { Question } from "@question/domain/types/question.entities";

import { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import { QuestionFilterOptions, QuestionSortableField, FindRandomQuestionsOptions, QuestionStats } from "@question/domain/types/question.types";
import { QuestionAggregate, QuestionMongooseDocument, QuestionStatsAggregationResult, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

@Injectable()
export class QuestionMongooseRepository implements QuestionRepository {
  public constructor(@InjectModel(QuestionMongooseSchema.name) private readonly questionModel: Model<QuestionMongooseDocument>) {}

  private static composeFindRandomMatchStage(options: FindRandomQuestionsOptions): Record<string, unknown> {
    const matchStage: Record<string, unknown> = { status: QUESTION_STATUS_ACTIVE };

    addArrayFilterIfNonEmpty(options.excludedIds, matchStage, "_id", ids => ({ $nin: ids.map(id => new Types.ObjectId(id)) }));
    addArrayFilterIfNonEmpty(options.categories, matchStage, "category", categories => ({ $in: categories }));
    addArrayFilterIfNonEmpty(options.cognitiveDifficulties, matchStage, "cognitiveDifficulty", difficulties => ({ $in: difficulties }));
    addArrayFilterIfNonEmpty(options.themeIds, matchStage, "themes.themeId", ids => ({ $in: ids.map(id => new Types.ObjectId(id)) }));

    return matchStage;
  }

  private static aggregateRowsToPartialRecord<T extends string>(rows: { _id: T | null; count: number }[]): Partial<Record<T, number>> {
    const record: Partial<Record<T, number>> = {};

    for (const row of rows) {
      if (row._id !== null) {
        record[row._id] = row.count;
      }
    }
    return record;
  }

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

  public async create(questionCreationContract: QuestionCreationContract): Promise<Question | undefined> {
    const questionCreationDocument = createQuestionMongooseInsertPayloadFromContract(questionCreationContract);
    const createdQuestionDocument = await this.questionModel.create(questionCreationDocument);

    return this.findById(createdQuestionDocument._id.toString());
  }

  public async archive(id: string): Promise<Question | undefined> {
    const update: UpdateQuery<QuestionMongooseDocument> = {
      status: QUESTION_STATUS_ARCHIVED,
    };
    await this.questionModel.findByIdAndUpdate(id, update);

    return this.findById(id);
  }

  public async assignTheme(questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract): Promise<Question | undefined> {
    const insertPayload = createQuestionThemeAssignmentMongooseInsertPayloadFromContract(questionThemeAssignmentCreationContract);

    if (questionThemeAssignmentCreationContract.isPrimary) {
      await this.assignNewPrimaryTheme(questionId, insertPayload);

      return this.findById(questionId);
    }
    const update: UpdateQuery<QuestionMongooseDocument> = {
      $push: { themes: insertPayload },
    };
    await this.questionModel.findByIdAndUpdate(questionId, update);

    return this.findById(questionId);
  }

  public async modifyThemeAssignment(questionId: string, themeId: string, contract: QuestionThemeAssignmentModificationContract): Promise<Question | undefined> {
    if (contract.isPrimary) {
      await this.promoteToPrimaryThemeAssignment(questionId, themeId, contract);

      return this.findById(questionId);
    }
    const setFields = getDefinedFieldsForMongoArrayElementUpdate(contract, "themes.$[elem]");
    if (Object.keys(setFields).length > 0) {
      const themeObjectId = new Types.ObjectId(themeId);
      await this.questionModel.findByIdAndUpdate(questionId, { $set: setFields }, { arrayFilters: [{ "elem.themeId": themeObjectId }] });
    }
    return this.findById(questionId);
  }

  public async modify(id: string, contract: QuestionModificationContract): Promise<Question | undefined> {
    const questionUpdateData = getCrushedDataForMongoPatchUpdate(contract);
    const updateQuery: UpdateQuery<QuestionMongooseDocument> = { $set: questionUpdateData };
    await this.questionModel.findByIdAndUpdate(id, updateQuery);

    return this.findById(id);
  }

  public async removeTheme(questionId: string, themeId: string): Promise<Question | undefined> {
    const update: UpdateQuery<QuestionMongooseDocument> = {
      $pull: {
        themes: { themeId: new Types.ObjectId(themeId) },
      },
    };
    await this.questionModel.findByIdAndUpdate(questionId, update);

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

  public async findRandom(options: FindRandomQuestionsOptions): Promise<Question[]> {
    const matchStage = QuestionMongooseRepository.composeFindRandomMatchStage(options);

    const questionWithThemes = await this.questionModel.aggregate<QuestionAggregate>([
      { $match: matchStage },
      { $sample: { size: options.limit } },
      ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
    ]);

    return questionWithThemes.map(createQuestionFromAggregate);
  }

  public async getStats(): Promise<QuestionStats> {
    const [result] = await this.questionModel.aggregate<QuestionStatsAggregationResult>(QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE);

    return {
      total: result.totalStage[0]?.count ?? 0,
      byStatus: QuestionMongooseRepository.aggregateRowsToPartialRecord(result.byStatusStage),
      byCategory: QuestionMongooseRepository.aggregateRowsToPartialRecord(result.byCategoryStage),
      byCognitiveDifficulty: QuestionMongooseRepository.aggregateRowsToPartialRecord(result.byCognitiveDifficultyStage),
      byAuthorRole: QuestionMongooseRepository.aggregateRowsToPartialRecord(result.byAuthorRoleStage),
      byRejectionType: QuestionMongooseRepository.aggregateRowsToPartialRecord(result.byRejectionTypeStage),
    };
  }

  private async assignNewPrimaryTheme(questionId: string, insertPayload: QuestionThemeAssignmentMongooseInsertPayload): Promise<void> {
    await this.questionModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: new Types.ObjectId(questionId) },
          update: { $set: { "themes.$[].isPrimary": false } },
        },
      },
      {
        updateOne: {
          filter: { _id: new Types.ObjectId(questionId) },
          update: { $push: { themes: insertPayload } },
        },
      },
    ]);
  }

  private async promoteToPrimaryThemeAssignment(questionId: string, themeId: string, contract: QuestionThemeAssignmentModificationContract): Promise<void> {
    const themeObjectId = new Types.ObjectId(themeId);
    const questionObjectId = new Types.ObjectId(questionId);
    const targetSetFields = getDefinedFieldsForMongoArrayElementUpdate({ ...contract, isPrimary: true }, "themes.$[elem]");
    await this.questionModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: questionObjectId },
          update: { $set: { "themes.$[].isPrimary": false } },
        },
      },
      {
        updateOne: {
          filter: { _id: questionObjectId },
          update: { $set: targetSetFields },
          arrayFilters: [{ "elem.themeId": themeObjectId }],
        },
      },
    ]);
  }
}