import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";

import { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import { QUESTION_STATUS_ARCHIVED } from "@question/domain/value-objects/question-status/question-status.constants";
import { QuestionCreationContract } from "@question/domain/contracts/question.contracts";
import { createQuestionMongooseInsertPayloadFromContract, createQuestionFromAggregate, createQuestionThemeAssignmentMongooseInsertPayloadFromContract } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { QUESTION_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

import { Question } from "@question/domain/entities/question.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import { QuestionMongooseDocument, QuestionAggregate } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

@Injectable()
export class QuestionMongooseRepository implements QuestionRepository {
  public constructor(@InjectModel(QuestionMongooseSchema.name) private readonly questionModel: Model<QuestionMongooseDocument>) {}

  public async findAll(): Promise<Question[]> {
    const questionWithThemes = await this.questionModel.aggregate<QuestionAggregate>(QUESTION_MONGOOSE_REPOSITORY_PIPELINE);

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
    const archivedQuestionDocument = await this.questionModel.findByIdAndUpdate(id, update, { new: true });
    if (!archivedQuestionDocument) {
      return undefined;
    }
    return this.findById(archivedQuestionDocument._id.toString());
  }

  public async assignTheme(questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract): Promise<Question | undefined> {
    const update: UpdateQuery<QuestionMongooseDocument> = {
      $push: {
        themes: createQuestionThemeAssignmentMongooseInsertPayloadFromContract(questionThemeAssignmentCreationContract),
      },
    };
    const updatedQuestionDocument = await this.questionModel.findByIdAndUpdate(questionId, update, { new: true });
    if (!updatedQuestionDocument) {
      return undefined;
    }
    return this.findById(updatedQuestionDocument._id.toString());
  }

  public async removeTheme(questionId: string, themeId: string): Promise<Question | undefined> {
    const update: UpdateQuery<QuestionMongooseDocument> = {
      $pull: {
        themes: { themeId: new Types.ObjectId(themeId) },
      },
    };
    const updatedQuestionDocument = await this.questionModel.findByIdAndUpdate(questionId, update, { new: true });
    if (!updatedQuestionDocument) {
      return undefined;
    }
    return this.findById(updatedQuestionDocument._id.toString());
  }
}