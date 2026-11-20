import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { createQuestionThemeFromDocument } from "@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema";
import { buildQuestionThemeFilterQuery } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme-filter.mongoose.helpers";
import { throwIfDuplicateKeyError } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme.mongoose.helpers";
import { QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE } from "@question-theme/infrastructure/persistence/mongoose/repository/pipelines/question-theme-stats/question-theme-stats.mongoose.repository.pipeline";

import { buildMongooseSortCriteria, getCrushedDataForMongoPatchUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
import { hasLimit } from "@shared/domain/rules/limit/limit.rules";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Model, UpdateQuery } from "mongoose";

import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/repositories/question-theme.repository-contracts.types";
import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField, QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";
import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";
import type { QuestionThemeMongooseDocument, QuestionThemeStatsAggregationResult } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

/**
 * Mongoose adapter for `QuestionThemeRepository`.
 *
 * The unique `slug` index is translated into `QuestionThemeSlugAlreadyExistsError` on create and modify; callers never see a raw `MongoServerError`.
 */
@Injectable()
export class QuestionThemeMongooseRepository implements QuestionThemeRepository {
  public constructor(@InjectModel(QuestionThemeMongooseSchema.name) private readonly questionThemeModel: Model<QuestionThemeMongooseDocument>) {}

  /**
   * Applies the filter conditions with a Mongoose query, then sorts and limits in the database; a missing or `0` limit retrieves every matching theme.
   */
  public async findAll(options: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>): Promise<QuestionTheme[]> {
    const sortCriteria = buildMongooseSortCriteria(options.sort);
    const filterQuery = buildQuestionThemeFilterQuery(options.filters);
    // Acceptable as .sort() is a Mongoose Query method, not Array.prototype.sort
    // oxlint-disable-next-line unicorn/no-array-sort
    const query = this.questionThemeModel.find(filterQuery).sort(sortCriteria);

    if (hasLimit(options.limit)) {
      query.limit(options.limit);
    }
    const questionThemeDocuments = await query;

    return questionThemeDocuments.map(createQuestionThemeFromDocument);
  }

  /**
   * Returns `undefined` when no document matches the id, leaving it to the caller to decide whether that is an error.
   */
  public async findById(id: string): Promise<QuestionTheme | undefined> {
    const questionThemeDocument = await this.questionThemeModel.findById(id);
    if (!questionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(questionThemeDocument);
  }

  public async findByIds(ids: Set<string>): Promise<QuestionTheme[]> {
    const questionThemeDocuments = await this.questionThemeModel.find({
      _id: { $in: [...ids] },
    });

    return questionThemeDocuments.map(createQuestionThemeFromDocument);
  }

  public async findBySlug(slug: string): Promise<QuestionTheme | undefined> {
    const questionThemeDocument = await this.questionThemeModel.findOne({
      slug,
    });
    if (!questionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(questionThemeDocument);
  }

  /**
   * Inserts the theme and returns it mapped from the created document.
   *
   * @throws `QuestionThemeSlugAlreadyExistsError` when the unique index rejects the insert because another theme uses the slug.
   */
  public async create(questionThemeCreationContract: QuestionThemeCreationContract): Promise<QuestionTheme> {
    try {
      const createdQuestionThemeDocument = await this.questionThemeModel.create(questionThemeCreationContract);

      return createQuestionThemeFromDocument(createdQuestionThemeDocument);
    } catch(error) {
      return throwIfDuplicateKeyError(error, questionThemeCreationContract.slug);
    }
  }

  /**
   * Patches the defined fields and returns the updated theme, or `undefined` when no document matches the id.
   *
   * @throws `QuestionThemeSlugAlreadyExistsError` when the new slug is already used by another theme.
   */
  public async modify(id: string, questionThemeModificationContract: QuestionThemeModificationContract): Promise<QuestionTheme | undefined> {
    const questionThemeUpdateData = getCrushedDataForMongoPatchUpdate(questionThemeModificationContract);
    const updateQuery: UpdateQuery<QuestionThemeMongooseDocument> = {
      $set: questionThemeUpdateData,
    };
    const modifiedQuestionThemeDocument = await this.updateQuestionThemeDocument(id, updateQuery, questionThemeModificationContract.slug);
    if (!modifiedQuestionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(modifiedQuestionThemeDocument);
  }

  /**
   * Sets the archived status and returns the document as stored after the update, or `undefined` when no theme matches the id.
   */
  public async archive(id: string): Promise<QuestionTheme | undefined> {
    const update: UpdateQuery<QuestionThemeMongooseDocument> = {
      status: QUESTION_THEME_STATUS_ARCHIVED,
    };
    const archivedQuestionThemeDocument = await this.questionThemeModel.findByIdAndUpdate(id, update, { returnDocument: "after" });
    if (!archivedQuestionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(archivedQuestionThemeDocument);
  }

  /**
   * Returns the aggregation counts with zero fallbacks, so a missing row yields `0` or an empty breakdown instead of `undefined`.
   */
  public async getStats(): Promise<QuestionThemeStats> {
    const [result] = await this.questionThemeModel.aggregate<QuestionThemeStatsAggregationResult>(QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE);

    return {
      total: result.total[0]?.count ?? 0,
      byStatus: result.statusRows[0] ?? {},
      byQuestionCount: result.byQuestionCount,
      byTranslationCompleteness: {
        fullyTranslated: result.fullyTranslatedCountStage[0]?.count ?? 0,
        incomplete: result.incompleteTranslationCountStage[0]?.count ?? 0,
      },
    };
  }

  private async updateQuestionThemeDocument(id: string, updateQuery: UpdateQuery<QuestionThemeMongooseDocument>, slug?: string): Promise<QuestionThemeMongooseDocument | null> {
    try {
      return await this.questionThemeModel.findByIdAndUpdate(id, updateQuery, { returnDocument: "after" });
    } catch(error) {
      return throwIfDuplicateKeyError(error, slug);
    }
  }
}