import { Test } from "@nestjs/testing";

import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mapper";

import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeAdminFindQuestionsSortQueryDto } from "@faketories/contexts/question/dto/admin-find-questions-sort-query/admin-find-questions-sort-query.dto.faketory";

import type { SortOptions } from "@shared/domain/types/sort.types";
import type { QuestionSortableField } from "@question/domain/repositories/question.repository.types";

describe("Find Questions Use Case", () => {
  let findQuestionsUseCase: FindQuestionsUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
  };
  let sortOptions: SortOptions<QuestionSortableField>;

  beforeEach(async() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        FindQuestionsUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    findQuestionsUseCase = testingModule.get<FindQuestionsUseCase>(FindQuestionsUseCase);
    sortOptions = createSortOptionsFromSortQueryDto(createFakeAdminFindQuestionsSortQueryDto());
  });

  describe(FindQuestionsUseCase.prototype.list, () => {
    it("should list all questions from repository when called.", async() => {
      await findQuestionsUseCase.list(sortOptions);

      expect(mocks.repositories.question.findAll).toHaveBeenCalledExactlyOnceWith(sortOptions);
    });

    it("should return questions from repository when called.", async() => {
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.repositories.question.findAll.mockResolvedValueOnce(expectedQuestions);

      const actualQuestions = await findQuestionsUseCase.list(sortOptions);

      expect(actualQuestions).toStrictEqual(expectedQuestions);
    });
  });
});