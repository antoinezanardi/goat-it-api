import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { Question } from "@question/domain/entities/question.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class FindAllQuestionsUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async list(): Promise<Question[]> {
    return this.questionRepository.findAll();
  }
}