import { Inject, Injectable } from "@nestjs/common";

import { QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import type { QuestionModificationCommand } from "@question/domain/commands/question-modification.commands";

import type { Question } from "@question/domain/entities/question.types";
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