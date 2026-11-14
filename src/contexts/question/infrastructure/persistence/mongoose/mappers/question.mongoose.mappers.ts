import { Types } from "mongoose";

import { createQuestionThemeFromPersistenceShape } from "@question-theme/contracts/persistence/question-theme.persistence.mappers";

import { QUESTION_AUTHOR_ROLE_GAME } from "@question/domain/constants/question.constants";
import { QuestionPersistenceMappingError } from "@question/infrastructure/persistence/mongoose/errors/question.mongoose.errors";
import type { Question } from "@question/domain/types/question.entities";
import type { QuestionAuthor, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionCreationContract, QuestionThemeAssignmentCreationContract } from "@question/domain/repositories/question.repository-contracts.types";
import type { QuestionAggregate, QuestionMongooseInsertPayload, QuestionThemeAggregate, QuestionThemeAssignmentAggregate, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

/**
 * Maps a theme aggregate embedded in a question pipeline result to the published theme entity.
 */
function createQuestionThemeFromAggregate(questionThemeAggregate: QuestionThemeAggregate): QuestionTheme {
  return createQuestionThemeFromPersistenceShape(questionThemeAggregate);
}

/**
 * Maps the stored question author to the domain value object, normalizing a game author's `gameId` to a string.
 *
 * @throws `QuestionPersistenceMappingError` when a `game`-authored question has no `gameId`, which would otherwise produce an invalid domain author.
 */
function createQuestionAuthorFromAggregate(questionAggregate: QuestionAggregate): QuestionAuthor {
  const { _id, author: questionAuthor } = questionAggregate;
  if (questionAuthor.role !== QUESTION_AUTHOR_ROLE_GAME) {
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

/**
 * Maps a theme-assignment aggregate to the domain value object, delegating the nested theme to `createQuestionThemeFromAggregate`.
 */
function createQuestionThemeAssignmentFromQuestionThemeAggregate(questionThemeAssignmentAggregate: QuestionThemeAssignmentAggregate): QuestionThemeAssignment {
  return {
    theme: createQuestionThemeFromAggregate(questionThemeAssignmentAggregate.theme),
    isPrimary: questionThemeAssignmentAggregate.isPrimary,
    isHint: questionThemeAssignmentAggregate.isHint,
  };
}

/**
 * Maps a question aggregation result to the domain entity, converting `_id` to a string `id` and the stored source URLs to a `Set`.
 */
function createQuestionFromAggregate(questionMongooseAggregate: QuestionAggregate): Question {
  return {
    id: questionMongooseAggregate._id.toString(),
    themes: questionMongooseAggregate.themes.map(themeAssignmentAggregate => createQuestionThemeAssignmentFromQuestionThemeAggregate(themeAssignmentAggregate)),
    content: questionMongooseAggregate.content,
    category: questionMongooseAggregate.category,
    cognitiveDifficulty: questionMongooseAggregate.cognitiveDifficulty,
    isAdultContent: questionMongooseAggregate.isAdultContent,
    author: createQuestionAuthorFromAggregate(questionMongooseAggregate),
    status: questionMongooseAggregate.status,
    rejection: questionMongooseAggregate.rejection,
    sourceUrls: new Set(questionMongooseAggregate.sourceUrls),
    applicableLocales: questionMongooseAggregate.applicableLocales,
    createdAt: questionMongooseAggregate.createdAt,
    updatedAt: questionMongooseAggregate.updatedAt,
  };
}

/**
 * Maps a theme-assignment creation contract to the Mongoose insert payload, converting `themeId` to an `ObjectId`.
 *
 * @throws `BSONError` when `themeId` is not a valid ObjectId; the HTTP layer rejects such ids before this mapper runs.
 */
function createQuestionThemeAssignmentMongooseInsertPayloadFromContract(questionThemeAssignmentCreateContract: QuestionThemeAssignmentCreationContract):
QuestionThemeAssignmentMongooseInsertPayload {
  return {
    themeId: new Types.ObjectId(questionThemeAssignmentCreateContract.themeId),
    isPrimary: questionThemeAssignmentCreateContract.isPrimary,
    isHint: questionThemeAssignmentCreateContract.isHint,
  };
}

/**
 * Maps a question-creation contract to the Mongoose insert payload, converting each theme id to an `ObjectId` and the source URLs to a plain array.
 */
function createQuestionMongooseInsertPayloadFromContract(questionCreateContract: QuestionCreationContract): QuestionMongooseInsertPayload {
  return {
    ...questionCreateContract,
    sourceUrls: [...questionCreateContract.sourceUrls],
    themes: questionCreateContract.themes.map(themeAssignmentCreateContract => createQuestionThemeAssignmentMongooseInsertPayloadFromContract(themeAssignmentCreateContract)),
  };
}

export {
  createQuestionThemeFromAggregate,
  createQuestionAuthorFromAggregate,
  createQuestionThemeAssignmentFromQuestionThemeAggregate,
  createQuestionFromAggregate,
  createQuestionThemeAssignmentMongooseInsertPayloadFromContract,
  createQuestionMongooseInsertPayloadFromContract,
};