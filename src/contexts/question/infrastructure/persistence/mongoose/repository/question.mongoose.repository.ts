import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";

import { getDefinedFieldsForMongoArrayElementUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

import { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import { QuestionCreationContract } from "@question/domain/contracts/question.contracts";
import { QUESTION_STATUS_ACTIVE, QUESTION_STATUS_ARCHIVED, QUESTION_STATUS_PENDING } from "@question/domain/value-objects/question-status/question-status.constants";
import { createQuestionFromAggregate, createQuestionMongooseInsertPayloadFromContract, createQuestionThemeAssignmentMongooseInsertPayloadFromContract } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { QUESTION_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QuestionThemeAssignmentModificationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment-modification.contracts";

import { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import { Question } from "@question/domain/entities/question.types";
import { QuestionAggregate, QuestionMongooseDocument, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

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