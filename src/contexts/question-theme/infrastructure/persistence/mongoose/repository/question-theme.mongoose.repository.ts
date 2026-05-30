import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateQuery } from "mongoose";

import { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";
import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { createQuestionThemeFromDocument } from "@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";
import { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import { buildQuestionThemeFilterQuery } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme-filter.mongoose.helpers";

import { getCrushedDataForMongoPatchUpdate, getMongoSortDirectionFromSortOrder } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
import type { MongoSortDirection } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

import { AdminQuestionThemeFilterOptions, QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";
import { QuestionThemeMongooseDocument } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

@Injectable()
export class QuestionThemeMongooseRepository implements QuestionThemeRepository {
  public constructor(@InjectModel(QuestionThemeMongooseSchema.name)
  private readonly questionThemeModel: Model<QuestionThemeMongooseDocument>) {}

  public async findAll(options: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>): Promise<QuestionTheme[]> {
    const sortDirection = getMongoSortDirectionFromSortOrder(options.sort.sortOrder);
    const sortCriteria: Record<string, MongoSortDirection> = { [options.sort.sortBy]: sortDirection, _id: sortDirection };
    const filterQuery = buildQuestionThemeFilterQuery(options.filters);
    // oxlint-disable-next-line unicorn/no-array-sort -- .sort() is a Mongoose Query method, not Array.prototype.sort
    const questionThemeDocuments = await this.questionThemeModel.find(filterQuery).sort(sortCriteria);

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
    const modifiedQuestionThemeDocument = await this.questionThemeModel.findByIdAndUpdate(id, updateQuery, { new: true });
    if (!modifiedQuestionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(modifiedQuestionThemeDocument);
  }

  public async archive(id: string): Promise<QuestionTheme | undefined> {
    const update: UpdateQuery<QuestionThemeMongooseDocument> = {
      status: QUESTION_THEME_STATUS_ARCHIVED,
    };
    const archivedQuestionThemeDocument = await this.questionThemeModel.findByIdAndUpdate(id, update, { new: true });
    if (!archivedQuestionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(archivedQuestionThemeDocument);
  }
}