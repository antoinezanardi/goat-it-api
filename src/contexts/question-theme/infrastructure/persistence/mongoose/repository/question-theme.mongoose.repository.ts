import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateQuery } from "mongoose";

import { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";
import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { createQuestionThemeFromDocument } from "@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";
import { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import { buildQuestionThemeFilterQuery } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme-filter.mongoose.helpers";
import { QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE } from "@question-theme/infrastructure/persistence/mongoose/repository/pipelines/question-theme-stats-pipeline/question-theme-stats.mongoose.repository.pipeline";

import { buildMongooseSortCriteria, getCrushedDataForMongoPatchUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
import { hasLimit } from "@shared/domain/rules/limit/limit.rules";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField, QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";
import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";
import type { QuestionThemeMongooseDocument, QuestionThemeStatsAggregationResult } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

@Injectable()
export class QuestionThemeMongooseRepository implements QuestionThemeRepository {
  public constructor(@InjectModel(QuestionThemeMongooseSchema.name) private readonly questionThemeModel: Model<QuestionThemeMongooseDocument>) {}

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
    const [result] = await this.questionThemeModel.aggregate<QuestionThemeStatsAggregationResult>(QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE);

    return {
      total: result.total[0]?.count ?? 0,
      byStatus: result.statusRows[0] ?? {},
      byQuestionCount: result.byQuestionCount,
    };
  }
}