import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/question-theme.controller";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme.dto.mappers";

import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-question-theme-by-id.use-case.mock";
import { createMockedFindAllQuestionThemesUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-all-question-themes.use-case.mock";

import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeQuestionTheme, createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/modules/question-theme/application/mappers/question-theme.dto.mappers"));

describe("Question Theme Controller", () => {
  let questionThemeController: QuestionThemeController;
  let mocks: {
    useCases: {
      findAllQuestionThemes: ReturnType<typeof createMockedFindAllQuestionThemesUseCase>;
      findQuestionThemeById: ReturnType<typeof createMockedFindQuestionThemeByIdUseCase>;
    };
    mappers: {
      createQuestionThemeDtoFromEntity: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      useCases: {
        findAllQuestionThemes: createMockedFindAllQuestionThemesUseCase(),
        findQuestionThemeById: createMockedFindQuestionThemeByIdUseCase(),
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
        {
          provide: FindQuestionThemeByIdUseCase,
          useValue: mocks.useCases.findQuestionThemeById,
        },
      ],
    }).compile();

    questionThemeController = testingModule.get<QuestionThemeController>(QuestionThemeController);
  });

  describe(QuestionThemeController.prototype.findAllQuestionThemes, () => {
    it("should list all question themes when called.", async() => {
      const localization = createFakeLocalizationOptions();
      await questionThemeController.findAllQuestionThemes(localization);

      expect(mocks.useCases.findAllQuestionThemes.list).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map every question theme to dto when called.", async() => {
      const localization = createFakeLocalizationOptions();
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      await questionThemeController.findAllQuestionThemes(localization);

      expect(mocks.mappers.createQuestionThemeDtoFromEntity).toHaveBeenCalledTimes(questionThemes.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const localization = createFakeLocalizationOptions();
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.useCases.findAllQuestionThemes.list.mockResolvedValueOnce(questionThemes);
      await questionThemeController.findAllQuestionThemes(localization);

      expect(mocks.mappers.createQuestionThemeDtoFromEntity).toHaveBeenCalledWith(questionThemes[0], localization);
    });
  });

  describe(QuestionThemeController.prototype.findQuestionThemeById, () => {
    it("should get question theme by id when called.", async() => {
      const questionThemeId = "question-theme-id";
      const localization = createFakeLocalizationOptions();
      await questionThemeController.findQuestionThemeById(questionThemeId, localization);

      expect(mocks.useCases.findQuestionThemeById.getById).toHaveBeenCalledExactlyOnceWith(questionThemeId);
    });

    it("should map the question theme to dto when called.", async() => {
      const questionThemeId = "question-theme-id";
      const localization = createFakeLocalizationOptions();
      const questionTheme = createFakeQuestionTheme();
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValueOnce(questionTheme);
      await questionThemeController.findQuestionThemeById(questionThemeId, localization);

      expect(mocks.mappers.createQuestionThemeDtoFromEntity).toHaveBeenCalledExactlyOnceWith(questionTheme, localization);
    });

    it("should return the mapped dto from the mapper when found.", async() => {
      const questionThemeId = "question-theme-id";
      const localization = createFakeLocalizationOptions();
      const questionTheme = createFakeQuestionTheme();
      const expectedDto = createFakeQuestionThemeDto();

      mocks.useCases.findQuestionThemeById.getById.mockResolvedValueOnce(questionTheme);
      mocks.mappers.createQuestionThemeDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await questionThemeController.findQuestionThemeById(questionThemeId, localization);

      expect(result).toStrictEqual<QuestionThemeDto>(expectedDto);
    });

    it("should throw NotFoundException when question theme is not found.", async() => {
      const questionThemeId = "question-theme-id";
      const localization = createFakeLocalizationOptions();
      const throwError = new QuestionThemeNotFoundError(questionThemeId);
      const expectedError = new NotFoundException({
        error: throwError.message,
      });
      mocks.useCases.findQuestionThemeById.getById.mockRejectedValue(throwError);

      await expect(async() => questionThemeController.findQuestionThemeById(questionThemeId, localization)).rejects.toThrowError(expectedError);
    });
  });
});