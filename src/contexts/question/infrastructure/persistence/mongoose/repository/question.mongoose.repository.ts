import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { QuestionCreationContract } from "@question/domain/contracts/question.contracts";
import { createQuestionMongooseInsertPayloadFromContract, createQuestionFromAggregate } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
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

    return this.findById(createdQuestionDocument.id);
  }
}