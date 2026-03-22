import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeAlreadyArchivedError, QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";
import { QUESTION_THEME_STATUS_ARCHIVED } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";
import { ensureNoLiveQuestionsReferenceTheme } from "@question/modules/question-theme/domain/policies/question-theme-archive/question-theme-archive.policies";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";
import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
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