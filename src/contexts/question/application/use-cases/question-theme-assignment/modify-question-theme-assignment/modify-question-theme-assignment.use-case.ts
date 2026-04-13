import { Inject, Injectable } from "@nestjs/common";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionThemeAssignmentModificationError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment-modification.errors";
import { ensureQuestionThemeAssignmentIsModifiable } from "@question/domain/policies/question-theme-assignment/question-theme-assignment.policies";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import type { QuestionThemeAssignmentModificationCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment-modification.commands";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import type { Question } from "@question/domain/entities/question.types";

@Injectable()
export class ModifyQuestionThemeAssignmentUseCase {
  public constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

  public async modify(command: QuestionThemeAssignmentModificationCommand): Promise<Question> {
    const { questionId, themeId, payload } = command;
    await this.throwIfThemeAssignmentNotModifiable(questionId, themeId);
    const updatedQuestion = await this.questionRepository.modifyThemeAssignment(questionId, themeId, payload);
    if (!updatedQuestion) {
      throw new QuestionThemeAssignmentModificationError(themeId, questionId);
    }
    return updatedQuestion;
  }

  private async throwIfThemeAssignmentNotModifiable(questionId: string, themeId: string): Promise<void> {
    const question = await this.findQuestionByIdUseCase.getById(questionId);
    ensureQuestionThemeAssignmentIsModifiable(question, themeId);
  }
}