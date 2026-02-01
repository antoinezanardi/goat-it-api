import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { QuestionController } from "@question/infrastructure/http/controllers/question/question.controller";
import { createQuestionDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";

import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";
import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedFindQuestionsUseCase } from "@mocks/contexts/question/application/use-cases/find-questions.use-case.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/application/mappers/question/question.dto.mappers"));

describe("Question Controller", () => {
  let questionController: QuestionController;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    useCases: {
      findQuestions: ReturnType<typeof createMockedFindQuestionsUseCase>;
      findQuestionById: ReturnType<typeof createMockedFindQuestionByIdUseCase>;
    };
    mappers: {
      createQuestionDtoFromEntity: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService(),
      },
      useCases: {
        findQuestions: createMockedFindQuestionsUseCase(),
        findQuestionById: createMockedFindQuestionByIdUseCase(),
      },
      mappers: {
        createQuestionDtoFromEntity: vi.mocked(createQuestionDtoFromEntity),
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
      ],
    }).compile();

    questionController = testingModule.get<QuestionController>(QuestionController);
  });

  describe(QuestionController.prototype.findQuestions, () => {
    it("should list all questions when called.", async() => {
      const localization = createFakeLocalizationOptions();
      await questionController.findQuestions(localization);

      expect(mocks.useCases.findQuestions.list).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map every question to dto when called.", async() => {
      const localization = createFakeLocalizationOptions();
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];

      await questionController.findQuestions(localization);

      expect(mocks.mappers.createQuestionDtoFromEntity).toHaveBeenCalledTimes(questions.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const localization = createFakeLocalizationOptions();
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findQuestions.list.mockResolvedValueOnce(questions);

      await questionController.findQuestions(localization);

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
});