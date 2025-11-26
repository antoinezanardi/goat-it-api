import { Test } from "@nestjs/testing";

import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { QuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/question-theme.controller";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme.dto.mappers";

import { createMockedFindAllQuestionThemesUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-all-question-themes.use-case.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/modules/question-theme/application/mappers/question-theme.dto.mappers"));

describe("Question Theme Controller", () => {
  let controllers: { questionTheme: QuestionThemeController };
  let mocks: {
    useCases: {
      findAllQuestionThemes: ReturnType<typeof createMockedFindAllQuestionThemesUseCase>;
    };
    mappers: {
      createQuestionThemeDtoFromEntity: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      useCases: {
        findAllQuestionThemes: createMockedFindAllQuestionThemesUseCase(),
      },
      mappers: {
        createQuestionThemeDtoFromEntity: vi.mocked(createQuestionThemeDtoFromEntity),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [QuestionThemeController],
      providers: [
        {
          provide: FindAllQuestionThemesUseCase,
          useValue: mocks.useCases.findAllQuestionThemes,
        },
      ],
    }).compile();

    controllers = { questionTheme: testingModule.get<QuestionThemeController>(QuestionThemeController) };
  });

  describe(QuestionThemeController.prototype.findAllQuestionThemes, () => {
    it("should list all question themes when called.", async() => {
      await controllers.questionTheme.findAllQuestionThemes();

      expect(mocks.useCases.findAllQuestionThemes.list).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map every question theme to dto when called.", async() => {
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      await controllers.questionTheme.findAllQuestionThemes();

      expect(mocks.mappers.createQuestionThemeDtoFromEntity).toHaveBeenCalledTimes(questionThemes.length);
    });
  });
});