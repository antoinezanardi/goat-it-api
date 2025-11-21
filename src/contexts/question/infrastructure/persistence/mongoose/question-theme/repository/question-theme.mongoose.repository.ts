import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateQuery } from "mongoose";

import { ARCHIVED_QUESTION_THEME_STATUS } from "@question/domain/value-objects/question-theme/question-theme-status.constants";
import { createQuestionThemeFromDocument } from "@question/infrastructure/persistence/mongoose/question-theme/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseSchema } from "@question/infrastructure/persistence/mongoose/question-theme/schema/question-theme.mongoose.schema";

import { QuestionThemeMongooseDocument } from "@question/infrastructure/persistence/mongoose/question-theme/types/question-theme.mongoose.types";
import { QuestionTheme } from "@question/domain/entities/question-theme/question-theme.types";
import { QuestionThemeRepository } from "@question/domain/repositories/question-theme/question-theme.repository.types";

@Injectable()
export class QuestionThemeMongooseRepository implements QuestionThemeRepository {
  public constructor(@InjectModel(QuestionThemeMongooseSchema.name)
  private readonly questionThemeModel: Model<QuestionThemeMongooseDocument>) {}

  public async findAll(): Promise<QuestionTheme[]> {
    const questionThemeDocuments = await this.questionThemeModel.find();

    return questionThemeDocuments.map(createQuestionThemeFromDocument);
  }

  public async findById(id: string): Promise<QuestionTheme | undefined> {
    const questionThemeDocument = await this.questionThemeModel.findById(id);
    if (!questionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(questionThemeDocument);
  }

  public async create(questionTheme: QuestionTheme): Promise<QuestionTheme> {
    const createdQuestionThemeDocument = await this.questionThemeModel.create(questionTheme);

    return createQuestionThemeFromDocument(createdQuestionThemeDocument);
  }

  public async archive(id: string): Promise<QuestionTheme | undefined> {
    const update: UpdateQuery<QuestionThemeMongooseDocument> = {
      status: ARCHIVED_QUESTION_THEME_STATUS,
    };
    const archivedQuestionThemeDocument = await this.questionThemeModel.findByIdAndUpdate(id, update, { new: true });
    if (!archivedQuestionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(archivedQuestionThemeDocument);
  }
}