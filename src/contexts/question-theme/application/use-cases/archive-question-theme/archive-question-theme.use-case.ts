import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeAlreadyArchivedError } from "@question-theme/domain/errors/question-theme-already-archived/question-theme-already-archived.error";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { ensureNoLiveQuestionsReferenceTheme } from "@question-theme/domain/rules/question-theme.rules";
import { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class ArchiveQuestionThemeUseCase {
  public constructor(
    @Inject(QUESTION_THEME_REPOSITORY_TOKEN)
    private readonly questionThemeRepository: QuestionThemeRepository,
    @Inject(QUESTION_REPOSITORY_TOKEN)
    private readonly questionRepository: QuestionRepository,
  ) {}

  public async archive(id: string): Promise<QuestionTheme> {
    await this.throwIfQuestionThemeNotArchivable(id);
    await this.throwIfLiveQuestionsReferenceTheme(id);
    const archivedQuestionTheme = await this.questionThemeRepository.archive(id);
    if (!archivedQuestionTheme) {
      throw new QuestionThemeNotFoundError(id);
    }
    return archivedQuestionTheme;
  }

  private async throwIfQuestionThemeNotArchivable(id: string): Promise<void> {
    const questionTheme = await this.questionThemeRepository.findById(id);
    if (!questionTheme) {
      throw new QuestionThemeNotFoundError(id);
    }
    if (questionTheme.status === QUESTION_THEME_STATUS_ARCHIVED) {
      throw new QuestionThemeAlreadyArchivedError(id);
    }
  }

  private async throwIfLiveQuestionsReferenceTheme(id: string): Promise<void> {
    const liveQuestionCount = await this.questionRepository.countLiveByThemeId(id);
    ensureNoLiveQuestionsReferenceTheme(liveQuestionCount, id);
  }
}