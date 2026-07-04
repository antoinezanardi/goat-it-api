import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createFindAllOptionsFromQueryDto } from "@shared/application/mappers/find-all-query-dto/find-all-query-dto.mappers";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { FindRandomQuestionsUseCase } from "@question/application/use-cases/find-random-questions/find-random-questions.use-case";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { QuestionController } from "@question/infrastructure/http/controllers/question/question.controller";
import { createQuestionDtoFromEntity } from "@question/application/mappers/question.mappers";
import { createPublicQuestionFilterOptionsFromQueryDto } from "@question/application/mappers/question-filter-query-dto/question-filter-query-dto.mappers";

import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";
import { createMockedFindRandomQuestionsUseCase } from "@mocks/contexts/question/application/use-cases/find-random-questions.use-case.mock";
import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedFindQuestionsUseCase } from "@mocks/contexts/question/application/use-cases/find-questions.use-case.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeFindQuestionsQueryDto } from "@faketories/contexts/question/dto/find-questions-query/find-questions-query.dto.faketory";
import { createFakeFindRandomQuestionsQueryDto } from "@faketories/contexts/question/dto/find-random-questions-query/find-random-questions-query.dto.faketory";

import type { Mock } from "vitest";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionFilterOptions, QuestionSortableField } from "@question/domain/types/question.types";

vi.mock(import("@question/application/mappers/question.mappers"));
vi.mock(import("@shared/application/mappers/find-all-query-dto/find-all-query-dto.mappers"));

describe("Question Controller", () => {
  let questionController: QuestionController;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    useCases: {
      findQuestions: ReturnType<typeof createMockedFindQuestionsUseCase>;
      findRandomQuestions: ReturnType<typeof createMockedFindRandomQuestionsUseCase>;
      findQuestionById: ReturnType<typeof createMockedFindQuestionByIdUseCase>;
    };
    mappers: {
      createQuestionDtoFromEntity: Mock;
      createFindAllOptionsFromQueryDto: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService(),
      },
      useCases: {
        findQuestions: createMockedFindQuestionsUseCase(),
        findRandomQuestions: createMockedFindRandomQuestionsUseCase(),
        findQuestionById: createMockedFindQuestionByIdUseCase(),
      },
      mappers: {
        createQuestionDtoFromEntity: vi.mocked(createQuestionDtoFromEntity),
        createFindAllOptionsFromQueryDto: vi.mocked(createFindAllOptionsFromQueryDto),
      },
    };

    const testingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
        {
          provide: FindQuestionsUseCase,
          useValue: mocks.useCases.findQuestions,
        },
        {
          provide: FindQuestionByIdUseCase,
          useValue: mocks.useCases.findQuestionById,
        },
        {
          provide: FindRandomQuestionsUseCase,
          useValue: mocks.useCases.findRandomQuestions,
        },
      ],
    }).compile();

    questionController = testingModule.get<QuestionController>(QuestionController);
  });

  describe(QuestionController.prototype.findQuestions, () => {
    it("should create find all options from query dto when called.", async() => {
      const queryDto = createFakeFindQuestionsQueryDto();
      const localization = createFakeLocalizationOptions();
      await questionController.findQuestions(queryDto, localization);

      expect(mocks.mappers.createFindAllOptionsFromQueryDto).toHaveBeenCalledExactlyOnceWith(queryDto, createPublicQuestionFilterOptionsFromQueryDto);
    });

    it("should list all questions with find all options when called.", async() => {
      const queryDto = createFakeFindQuestionsQueryDto();
      const localization = createFakeLocalizationOptions();
      const expectedFindAllOptions: FindAllOptions<QuestionSortableField, QuestionFilterOptions> = { sort: { sortBy: "createdAt", sortOrder: "desc" } };
      mocks.mappers.createFindAllOptionsFromQueryDto.mockReturnValueOnce(expectedFindAllOptions);
      await questionController.findQuestions(queryDto, localization);

      expect(mocks.useCases.findQuestions.list).toHaveBeenCalledExactlyOnceWith(expectedFindAllOptions);
    });

    it("should map every question to dto when called.", async() => {
      const queryDto = createFakeFindQuestionsQueryDto();
      const localization = createFakeLocalizationOptions();
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findQuestions.list.mockResolvedValueOnce(questions);
      await questionController.findQuestions(queryDto, localization);

      expect(mocks.mappers.createQuestionDtoFromEntity).toHaveBeenCalledTimes(questions.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const queryDto = createFakeFindQuestionsQueryDto();
      const localization = createFakeLocalizationOptions();
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findQuestions.list.mockResolvedValueOnce(questions);

      await questionController.findQuestions(queryDto, localization);

      expect(mocks.mappers.createQuestionDtoFromEntity).toHaveBeenCalledWith(questions[0], localization);
    });
  });

  describe(QuestionController.prototype.findQuestionById, () => {
    it("should get question by id when called.", async() => {
      const localization = createFakeLocalizationOptions();
      const questionId = "123";
      await questionController.findQuestionById(questionId, localization);

      expect(mocks.useCases.findQuestionById.getById).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should map the question to dto when called.", async() => {
      const localization = createFakeLocalizationOptions();
      const questionId = "123";
      const question = createFakeQuestion();
      mocks.useCases.findQuestionById.getById.mockResolvedValueOnce(question);
      await questionController.findQuestionById(questionId, localization);

      expect(mocks.mappers.createQuestionDtoFromEntity).toHaveBeenCalledExactlyOnceWith(question, localization);
    });
  });

  describe(QuestionController.prototype.findRandomQuestions, () => {
    it("should list random questions with query limit when called.", async() => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({ limit: 5 });
      const localization = createFakeLocalizationOptions();
      await questionController.findRandomQuestions(queryDto, localization);

      expect(mocks.useCases.findRandomQuestions.list).toHaveBeenCalledExactlyOnceWith({ limit: 5 });
    });

    it("should pass the default limit when query dto has the default value.", async() => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({ limit: 20 });
      const localization = createFakeLocalizationOptions();
      await questionController.findRandomQuestions(queryDto, localization);

      expect(mocks.useCases.findRandomQuestions.list).toHaveBeenCalledExactlyOnceWith({ limit: 20 });
    });

    it("should map every question to dto when called.", async() => {
      const queryDto = createFakeFindRandomQuestionsQueryDto();
      const localization = createFakeLocalizationOptions();
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findRandomQuestions.list.mockResolvedValueOnce(questions);
      await questionController.findRandomQuestions(queryDto, localization);

      expect(mocks.mappers.createQuestionDtoFromEntity).toHaveBeenCalledTimes(questions.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const queryDto = createFakeFindRandomQuestionsQueryDto();
      const localization = createFakeLocalizationOptions();
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findRandomQuestions.list.mockResolvedValueOnce(questions);

      await questionController.findRandomQuestions(queryDto, localization);

      expect(mocks.mappers.createQuestionDtoFromEntity).toHaveBeenCalledWith(questions[0], localization);
    });
  });
});