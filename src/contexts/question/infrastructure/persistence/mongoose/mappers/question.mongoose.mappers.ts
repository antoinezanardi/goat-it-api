import { Types } from "mongoose";

import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import type { QuestionCreationContract } from "@question/domain/contracts/question.contracts";
import { QuestionPersistenceMappingError } from "@question/infrastructure/persistence/mongoose/errors/question.mongoose.errors";
import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";

import type { Question } from "@question/domain/entities/question.types";
import type { QuestionAuthor } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";
import type { QuestionAggregate, QuestionMongooseInsertPayload, QuestionThemeAssignmentAggregate, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

function createQuestionAuthorFromAggregate(questionAggregate: QuestionAggregate): QuestionAuthor {
  const { _id, author: questionAuthor } = questionAggregate;
  if (questionAuthor.role !== "game") {
    return {
      role: questionAuthor.role,
      name: questionAuthor.name,
    };
  }
  if (!("gameId" in questionAuthor) || questionAuthor.gameId === undefined) {
    throw new QuestionPersistenceMappingError(_id.toString(), `Missing gameId for question author with role 'game'`);
  }
  return {
    role: questionAuthor.role,
    gameId: questionAuthor.gameId.toString(),
    name: questionAuthor.name,
  };
}

function createQuestionThemeAssignmentFromQuestionThemeAggregate(questionThemeAssignmentAggregate: QuestionThemeAssignmentAggregate): QuestionThemeAssignment {
  return {
    theme: createQuestionThemeFromDocument(questionThemeAssignmentAggregate.theme),
    isPrimary: questionThemeAssignmentAggregate.isPrimary,
    isHint: questionThemeAssignmentAggregate.isHint,
  };
}

function createQuestionFromAggregate(questionMongooseAggregate: QuestionAggregate): Question {
  return {
    id: questionMongooseAggregate._id.toString(),
    themes: questionMongooseAggregate.themes.map(themeAssignmentAggregate => createQuestionThemeAssignmentFromQuestionThemeAggregate(themeAssignmentAggregate)),
    content: questionMongooseAggregate.content,
    cognitiveDifficulty: questionMongooseAggregate.cognitiveDifficulty,
    author: createQuestionAuthorFromAggregate(questionMongooseAggregate),
    status: questionMongooseAggregate.status,
    rejection: questionMongooseAggregate.rejection,
    sourceUrls: new Set(questionMongooseAggregate.sourceUrls),
    createdAt: questionMongooseAggregate.createdAt,
    updatedAt: questionMongooseAggregate.updatedAt,
  };
}

function createQuestionThemeAssignmentMongooseInsertPayloadFromContract(questionThemeAssignmentCreateContract: QuestionThemeAssignmentCreationContract):
QuestionThemeAssignmentMongooseInsertPayload {
  return {
    themeId: new Types.ObjectId(questionThemeAssignmentCreateContract.themeId),
    isPrimary: questionThemeAssignmentCreateContract.isPrimary,
    isHint: questionThemeAssignmentCreateContract.isHint,
  };
}

function createQuestionMongooseInsertPayloadFromContract(questionCreateContract: QuestionCreationContract): QuestionMongooseInsertPayload {
  return {
    ...questionCreateContract,
    sourceUrls: [...questionCreateContract.sourceUrls],
    themes: questionCreateContract.themes.map(themeAssignmentCreateContract => createQuestionThemeAssignmentMongooseInsertPayloadFromContract(themeAssignmentCreateContract)),
  };
}

export {
  createQuestionAuthorFromAggregate,
  createQuestionThemeAssignmentFromQuestionThemeAggregate,
  createQuestionFromAggregate,
  createQuestionThemeAssignmentMongooseInsertPayloadFromContract,
  createQuestionMongooseInsertPayloadFromContract,
};