import { Test } from "@nestjs/testing";

import { createQuestionThemeDtoFromEntity } from "@question-theme/application/mappers/question-theme.mappers";
import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { QuestionThemeController } from "@question-theme/infrastructure/http/controllers/question-theme/question-theme.controller";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mappers";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question-theme/application/use-cases/find-question-theme-by-id.use-case.mock";
import { createMockedFindQuestionThemesUseCase } from "@mocks/contexts/question-theme/application/use-cases/find-question-themes.use-case.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeDto } from "@faketories/contexts/question-theme/dto/question-theme.dto.faketory";
import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeFindQuestionThemesQueryDto } from "@faketories/contexts/question-theme/dto/find-question-themes-query/find-question-themes-query.dto.faketory";

import type { Mock } from "vitest";

import type { QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { SortOptions } from "@shared/domain/types/sort/sort.types";

vi.mock(import("@question-theme/application/mappers/question-theme.mappers"));
vi.mock(import("@shared/application/mappers/sort-query-dto/sort-query-dto.mappers"));

describe("Question Theme Controller", () => {
  let questionThemeController: QuestionThemeController;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    useCases: {
      findQuestionThemes: ReturnType<typeof createMockedFindQuestionThemesUseCase>;
      findQuestionThemeById: ReturnType<typeof createMockedFindQuestionThemeByIdUseCase>;
    };
    mappers: {
      createQuestionThemeDtoFromEntity: Mock;
      createSortOptionsFromSortQueryDto: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService(),
      },
      useCases: {
        findQuestionThemes: createMockedFindQuestionThemesUseCase(),
        findQuestionThemeById: createMockedFindQuestionThemeByIdUseCase(),
      },
      mappers: {
        createQuestionThemeDtoFromEntity: vi.mocked(createQuestionThemeDtoFromEntity),
        createSortOptionsFromSortQueryDto: vi.mocked(createSortOptionsFromSortQueryDto),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [QuestionThemeController],
      providers: [
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
        {
          provide: FindQuestionThemesUseCase,
          useValue: mocks.useCases.findQuestionThemes,
        },
        {
          provide: FindQuestionThemeByIdUseCase,
          useValue: mocks.useCases.findQuestionThemeById,
        },
      ],
    }).compile();

    questionThemeController = testingModule.get<QuestionThemeController>(QuestionThemeController);
  });

  describe(QuestionThemeController.prototype.findQuestionThemes, () => {
    it("should create sort options from sort query dto when called.", async() => {
      const queryDto = createFakeFindQuestionThemesQueryDto();
      const localization = createFakeLocalizationOptions();
      await questionThemeController.findQuestionThemes(queryDto, localization);

      expect(mocks.mappers.createSortOptionsFromSortQueryDto).toHaveBeenCalledExactlyOnceWith(queryDto);
    });

    it("should list all question themes with find all options when called.", async() => {
      const queryDto = createFakeFindQuestionThemesQueryDto();
      const localization = createFakeLocalizationOptions();
      const expectedSortOptions: SortOptions<QuestionThemeSortableField> = { sortBy: "createdAt", sortOrder: "desc" };
      mocks.mappers.createSortOptionsFromSortQueryDto.mockReturnValueOnce(expectedSortOptions);
      await questionThemeController.findQuestionThemes(queryDto, localization);

      expect(mocks.useCases.findQuestionThemes.list).toHaveBeenCalledExactlyOnceWith({ sort: expectedSortOptions });
    });

    it("should map every question theme to dto when called.", async() => {
      const queryDto = createFakeFindQuestionThemesQueryDto();
      const localization = createFakeLocalizationOptions();
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.useCases.findQuestionThemes.list.mockResolvedValueOnce(questionThemes);
      await questionThemeController.findQuestionThemes(queryDto, localization);

      expect(mocks.mappers.createQuestionThemeDtoFromEntity).toHaveBeenCalledTimes(questionThemes.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const queryDto = createFakeFindQuestionThemesQueryDto();
      const localization = createFakeLocalizationOptions();
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.useCases.findQuestionThemes.list.mockResolvedValueOnce(questionThemes);
      await questionThemeController.findQuestionThemes(queryDto, localization);

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

      expect(result).toStrictEqual(expectedDto);
    });
  });
});