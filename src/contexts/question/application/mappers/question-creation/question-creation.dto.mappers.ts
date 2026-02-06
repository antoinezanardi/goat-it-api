import type { QuestionAuthorCreationDto } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto.shape";
import type { QuestionContentCreationDto } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto.shape";
import type { QuestionCreationDto } from "@question/application/dto/question-creation/question-creation.dto.shape";
import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";
import type { QuestionCreationCommand } from "@question/domain/commands/question.commands";
import type { QuestionAuthorCreationContract } from "@question/domain/contracts/question-author/question-author.contracts";
import type { QuestionContentCreationContract } from "@question/domain/contracts/question-content/question-content.contracts";
import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import { computeQuestionStatusFromAuthorRole } from "@question/domain/policies/question-creation/question-creation.policies";

function createQuestionThemeAssignmentCreationContractFromDto(questionThemeAssignmentDto: QuestionThemeAssignmentCreationDto): QuestionThemeAssignmentCreationContract {
  return {
    themeId: questionThemeAssignmentDto.themeId,
    isPrimary: questionThemeAssignmentDto.isPrimary,
    isHint: questionThemeAssignmentDto.isHint,
  };
}

function createQuestionAuthorCreationContractFromDto(questionAuthorDto: QuestionAuthorCreationDto): QuestionAuthorCreationContract {
  return {
    role: questionAuthorDto.role,
    name: questionAuthorDto.name,
  };
}

function createQuestionContentCreationContractFromDto(questionContentDto: QuestionContentCreationDto): QuestionContentCreationContract {
  return {
    statement: questionContentDto.statement,
    answer: questionContentDto.answer,
    context: questionContentDto.context,
    trivia: questionContentDto.trivia,
  };
}

function createQuestionCreationCommandFromDto(dto: QuestionCreationDto): QuestionCreationCommand {
  return {
    payload: {
      themes: dto.themes.map(createQuestionThemeAssignmentCreationContractFromDto),
      content: createQuestionContentCreationContractFromDto(dto.content),
      cognitiveDifficulty: dto.cognitiveDifficulty,
      author: createQuestionAuthorCreationContractFromDto(dto.author),
      status: computeQuestionStatusFromAuthorRole(dto.author.role),
      sourceUrls: new Set(dto.sourceUrls),
    },
  };
}

export {
  createQuestionThemeAssignmentCreationContractFromDto,
  createQuestionAuthorCreationContractFromDto,
  createQuestionContentCreationContractFromDto,
  createQuestionCreationCommandFromDto,
};