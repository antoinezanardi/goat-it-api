import { Test } from "@nestjs/testing";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";
import { createQuestionThemeDraftEntityFromCreateDto } from "@question/modules/question-theme/application/mappers/create-question-theme/create-question-theme.dto.mappers";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import { CreateQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { QuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/question-theme/question-theme.controller";

import { createMockedFindAllQuestionThemesUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-all-question-themes.use-case.mock";
import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-question-theme-by-id.use-case.mock";
import { createMockedCreateQuestionThemeUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/create-question-theme.use-case.mock";

import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeCreateQuestionThemeDto, createFakeQuestionTheme, createFakeQuestionThemeDraft, createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers"));
vi.mock(import("@question/modules/question-theme/application/mappers/create-question-theme/create-question-theme.dto.mappers"));

describe("Question Theme Controller", () => {
  let questionThemeController: QuestionThemeController;
  let mocks: {
    useCases: {
      findAllQuestionThemes: ReturnType<typeof createMockedFindAllQuestionThemesUseCase>;
      findQuestionThemeById: ReturnType<typeof createMockedFindQuestionThemeByIdUseCase>;
      createQuestionTheme: ReturnType<typeof createMockedCreateQuestionThemeUseCase>;
    };
    mappers: {
      createQuestionThemeDtoFromEntity: Mock;
      createQuestionThemeDraftEntityFromCreateDto: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      useCases: {
        findAllQuestionThemes: createMockedFindAllQuestionThemesUseCase(),
        findQuestionThemeById: createMockedFindQuestionThemeByIdUseCase(),
        createQuestionTheme: createMockedCreateQuestionThemeUseCase(),
      },
      mappers: {
        createQuestionThemeDtoFromEntity: vi.mocked(createQuestionThemeDtoFromEntity),
        createQuestionThemeDraftEntityFromCreateDto: vi.mocked(createQuestionThemeDraftEntityFromCreateDto),
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
        {
          provide: CreateQuestionThemeUseCase,
          useValue: mocks.useCases.createQuestionTheme,
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
  });

  describe(QuestionThemeController.prototype.createQuestionTheme, () => {
    it("should map create question theme dto to draft entity when called.", async() => {
      const createQuestionThemeDto = createFakeCreateQuestionThemeDto();
      const localization = createFakeLocalizationOptions();
      await questionThemeController.createQuestionTheme(createQuestionThemeDto, localization);

      expect(mocks.mappers.createQuestionThemeDraftEntityFromCreateDto).toHaveBeenCalledExactlyOnceWith(createQuestionThemeDto);
    });

    it("should create question theme when called.", async() => {
      const createQuestionThemeDto = createFakeCreateQuestionThemeDto();
      const localization = createFakeLocalizationOptions();
      const mappedQuestionThemeDraft = createFakeQuestionThemeDraft();
      mocks.mappers.createQuestionThemeDraftEntityFromCreateDto.mockReturnValueOnce(mappedQuestionThemeDraft);
      await questionThemeController.createQuestionTheme(createQuestionThemeDto, localization);

      expect(mocks.useCases.createQuestionTheme.create).toHaveBeenCalledExactlyOnceWith(mappedQuestionThemeDraft);
    });

    it("should map the created question theme to dto when created.", async() => {
      const createQuestionThemeDto = createFakeCreateQuestionThemeDto();
      const localization = createFakeLocalizationOptions();
      const createdQuestionTheme = createFakeQuestionTheme();
      mocks.useCases.createQuestionTheme.create.mockResolvedValueOnce(createdQuestionTheme);
      await questionThemeController.createQuestionTheme(createQuestionThemeDto, localization);

      expect(mocks.mappers.createQuestionThemeDtoFromEntity).toHaveBeenCalledExactlyOnceWith(createdQuestionTheme, localization);
    });

    it("should return the mapped dto from the mapper when created.", async() => {
      const createQuestionThemeDto = createFakeCreateQuestionThemeDto();
      const localization = createFakeLocalizationOptions();
      const createdQuestionTheme = createFakeQuestionTheme();
      const expectedDto = createFakeQuestionThemeDto();

      mocks.useCases.createQuestionTheme.create.mockResolvedValueOnce(createdQuestionTheme);
      mocks.mappers.createQuestionThemeDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await questionThemeController.createQuestionTheme(createQuestionThemeDto, localization);

      expect(result).toStrictEqual<QuestionThemeDto>(expectedDto);
    });
  });
});