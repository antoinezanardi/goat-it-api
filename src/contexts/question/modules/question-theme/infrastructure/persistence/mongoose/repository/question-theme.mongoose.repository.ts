import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateQuery } from "mongoose";

import { QuestionThemeUpdateContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";
import { ARCHIVED_QUESTION_THEME_STATUS } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";
import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseSchema } from "@question/modules/question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";
import { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeMongooseDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";

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

  public async findBySlug(slug: string): Promise<QuestionTheme | undefined> {
    const questionThemeDocument = await this.questionThemeModel.findOne({
      slug,
    });
    if (!questionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(questionThemeDocument);
  }

  public async create(questionTheme: QuestionThemeDraft): Promise<QuestionTheme> {
    const createdQuestionThemeDocument = await this.questionThemeModel.create(questionTheme);

    return createQuestionThemeFromDocument(createdQuestionThemeDocument);
  }

  public async update(id: string, questionThemeUpdateContract: QuestionThemeUpdateContract): Promise<QuestionTheme | undefined> {
    const updatedQuestionThemeDocument = await this.questionThemeModel.findByIdAndUpdate(
      id,
      questionThemeUpdateContract,
      { new: true },
    );
    if (!updatedQuestionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(updatedQuestionThemeDocument);
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