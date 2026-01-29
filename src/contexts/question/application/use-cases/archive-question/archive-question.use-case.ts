import { Inject, Injectable } from "@nestjs/common";

import { QuestionAlreadyArchivedError, QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QUESTION_STATUS_ARCHIVED } from "@question/domain/value-objects/question-status/question-status.constants";

import { Question } from "@question/domain/entities/question.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class ArchiveQuestionUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async archive(id: string): Promise<Question> {
    await this.throwIfQuestionNotArchivable(id);
    const archivedQuestion = await this.questionRepository.archive(id);
    if (!archivedQuestion) {
      throw new QuestionNotFoundError(id);
    }
    return archivedQuestion;
  }

  private async throwIfQuestionNotArchivable(id: string): Promise<void> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new QuestionNotFoundError(id);
    }
    if (question.status === QUESTION_STATUS_ARCHIVED) {
      throw new QuestionAlreadyArchivedError(id);
    }
  }
}