import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateQuery } from "mongoose";

import { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";
import { QUESTION_THEME_STATUSES, QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { createQuestionThemeFromDocument } from "@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";
import { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import { buildQuestionThemeFilterQuery } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme-filter.mongoose.helpers";
import { QUESTION_THEME_FACET_MONGOOSE_REPOSITORY_PIPELINE, QUESTION_ACTIVE_QUESTION_COUNT_MONGOOSE_REPOSITORY_PIPELINE } from "@question-theme/infrastructure/persistence/mongoose/repository/pipelines/question-theme-stats-pipeline/question-theme-stats.mongoose.repository.pipeline";

import { buildMongooseSortCriteria, getCrushedDataForMongoPatchUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
import { hasLimit } from "@shared/domain/rules/limit/limit.rules";

import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField, QuestionThemeActiveQuestionStatsCount, QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";
import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";
import type { QuestionCountAggregationRow, QuestionThemeFacetAggregationResult, QuestionThemeLeanProjection, QuestionThemeMongooseDocument } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionMongooseDocument } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

@Injectable()
export class QuestionThemeMongooseRepository implements QuestionThemeRepository {
  public constructor(
    @InjectModel(QuestionThemeMongooseSchema.name) private readonly questionThemeModel: Model<QuestionThemeMongooseDocument>,
    @InjectModel(QuestionMongooseSchema.name) private readonly questionModel: Model<QuestionMongooseDocument>,
  ) {}

  private static mapAggregationRowsToRecord<T extends string>(
    rows: { _id: T | null; count: number }[],
    keys: readonly T[],
  ): Record<T, number> {
    const record: Partial<Record<T, number>> = {};
    for (const key of keys) {
      record[key] = 0;
    }
    for (const row of rows) {
      if (row._id !== null) {
        record[row._id] = row.count;
      }
    }
    // Acceptable as all keys have been initialized to 0; the Partial assignment is a safety net
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return record as Record<T, number>;
  }

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

  public async create(questionThemeCreationContract: QuestionThemeCreationContract): Promise<QuestionTheme> {
    const createdQuestionThemeDocument = await this.questionThemeModel.create(questionThemeCreationContract);

    return createQuestionThemeFromDocument(createdQuestionThemeDocument);
  }

  public async modify(id: string, questionThemeModificationContract: QuestionThemeModificationContract): Promise<QuestionTheme | undefined> {
    const questionThemeUpdateData = getCrushedDataForMongoPatchUpdate(questionThemeModificationContract);
    const updateQuery: UpdateQuery<QuestionThemeMongooseDocument> = {
      $set: questionThemeUpdateData,
    };
    const modifiedQuestionThemeDocument = await this.questionThemeModel.findByIdAndUpdate(id, updateQuery, { returnDocument: "after" });
    if (!modifiedQuestionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(modifiedQuestionThemeDocument);
  }

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

  public async getStats(): Promise<QuestionThemeStats> {
    const { total, byStatus } = await this.getThemeAggregationResult();
    const activeCountMap = await this.getActiveQuestionCountMap();
    const allThemes = await this.getThemesSortedBySlug();

    const byQuestionCount: QuestionThemeActiveQuestionStatsCount[] = [];
    for (const theme of allThemes) {
      byQuestionCount.push({
        themeId: theme._id.toString(),
        themeSlug: theme.slug,
        activeQuestionCount: activeCountMap.get(theme._id.toString()) ?? 0,
      });
    }
    return { total, byStatus, byQuestionCount };
  }

  private async getThemeAggregationResult(): Promise<{
    total: number;
    byStatus: Record<QuestionThemeStatus, number>;
  }> {
    const [themeAggResult] = await this.questionThemeModel.aggregate<QuestionThemeFacetAggregationResult>(QUESTION_THEME_FACET_MONGOOSE_REPOSITORY_PIPELINE);
    const total = themeAggResult.total.length > 0 ? themeAggResult.total[0].count : 0;
    const byStatus = QuestionThemeMongooseRepository.mapAggregationRowsToRecord(
      themeAggResult.statusRows,
      QUESTION_THEME_STATUSES,
    );

    return { total, byStatus };
  }

  private async getActiveQuestionCountMap(): Promise<Map<string, number>> {
    const activeCountRows = await this.questionModel.aggregate<QuestionCountAggregationRow>(QUESTION_ACTIVE_QUESTION_COUNT_MONGOOSE_REPOSITORY_PIPELINE);

    const activeCountMap: Map<string, number> = new Map();
    for (const row of activeCountRows) {
      activeCountMap.set(row._id.toString(), row.count);
    }
    return activeCountMap;
  }

  private async getThemesSortedBySlug(): Promise<QuestionThemeLeanProjection[]> {
    // Acceptable as this is a Mongoose Query method, not Array.prototype.find
    // oxlint-disable-next-line unicorn/no-array-method-this-argument
    const allThemes = await this.questionThemeModel.find({}, { slug: 1 }).sort({ slug: 1 }).lean();

    return allThemes;
  }
}