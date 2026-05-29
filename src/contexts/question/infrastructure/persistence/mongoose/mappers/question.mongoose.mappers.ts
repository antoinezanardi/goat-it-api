import { Types } from "mongoose";

import { createQuestionThemeFromDocument } from "@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";

import type { QuestionCreationContract, QuestionThemeAssignmentCreationContract } from "@question/domain/types/question.contracts";
import { QuestionPersistenceMappingError } from "@question/infrastructure/persistence/mongoose/errors/question.mongoose.errors";
import type { Question } from "@question/domain/types/question.entities";
import type { QuestionAuthor, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";

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
    category: questionMongooseAggregate.category,
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