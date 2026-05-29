import { Inject, Injectable } from "@nestjs/common";

import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import type { QuestionModificationCommand } from "@question/domain/types/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class ModifyQuestionUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async modify(questionModificationCommand: QuestionModificationCommand): Promise<Question> {
    const { questionId, payload } = questionModificationCommand;
    const modifiedQuestion = await this.questionRepository.modify(questionId, payload);
    if (!modifiedQuestion) {
      throw new QuestionNotFoundError(questionId);
    }
    return modifiedQuestion;
  }
}