import { Inject, Injectable } from "@nestjs/common";

import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { Question } from "@question/domain/types/question.entities";

import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class FindQuestionByIdUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async getById(id: string): Promise<Question> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new QuestionNotFoundError(id);
    }
    return question;
  }
}