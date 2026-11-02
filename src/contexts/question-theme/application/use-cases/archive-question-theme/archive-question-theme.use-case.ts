import { QuestionThemeAlreadyArchivedError } from "@question-theme/domain/errors/question-theme-already-archived/question-theme-already-archived.error";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";
import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { ensureNoLiveQuestionsReferenceTheme } from "@question-theme/domain/rules/question-theme.rules";

import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

export class ArchiveQuestionThemeUseCase {
  public constructor(
    private readonly questionThemeRepository: QuestionThemeRepository,
    private readonly countLiveQuestionsByThemeIdUseCase: CountLiveQuestionsByThemeIdUseCase,
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
    const liveQuestionCount = await this.countLiveQuestionsByThemeIdUseCase.execute(id);
    ensureNoLiveQuestionsReferenceTheme(liveQuestionCount, id);
  }
}