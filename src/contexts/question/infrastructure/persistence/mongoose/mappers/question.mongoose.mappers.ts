import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";

import type { Question } from "@question/domain/entities/question.types";
import type { QuestionAuthor } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";
import type { QuestionAggregate, QuestionThemeAssignmentAggregate } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

function createQuestionAuthorFromAggregate(questionAuthor: QuestionAggregate["author"]): QuestionAuthor {
  if (questionAuthor.role === "game") {
    if (!("gameId" in questionAuthor) || questionAuthor.gameId === undefined || questionAuthor.gameId === "") {
      throw new Error("Missing gameId for question author with role 'game'");
    }
    return { role: questionAuthor.role, gameId: questionAuthor.gameId, name: questionAuthor.name };
  }
  return { role: questionAuthor.role, name: questionAuthor.name };
}

function createQuestionThemeAssignmentFromAggregate(questionThemeAssignmentAggregate: QuestionThemeAssignmentAggregate): QuestionThemeAssignment {
  return {
    theme: createQuestionThemeFromDocument(questionThemeAssignmentAggregate.theme),
    isPrimary: questionThemeAssignmentAggregate.isPrimary,
    isHint: questionThemeAssignmentAggregate.isHint,
  };
}

function createQuestionFromAggregate(questionMongooseAggregate: QuestionAggregate): Question {
  return {
    id: questionMongooseAggregate._id.toString(),
    themes: questionMongooseAggregate.themes.map(themeAssignmentAggregate => createQuestionThemeAssignmentFromAggregate(themeAssignmentAggregate)),
    content: questionMongooseAggregate.content,
    cognitiveDifficulty: questionMongooseAggregate.cognitiveDifficulty,
    author: createQuestionAuthorFromAggregate(questionMongooseAggregate.author),
    status: questionMongooseAggregate.status,
    sourceUrls: new Set(questionMongooseAggregate.sourceUrls),
    createdAt: questionMongooseAggregate.createdAt,
    updatedAt: questionMongooseAggregate.updatedAt,
  };
}

export {
  createQuestionFromAggregate,
};