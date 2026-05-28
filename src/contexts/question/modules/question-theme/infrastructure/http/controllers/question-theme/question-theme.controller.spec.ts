import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mapper";

import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import { FindQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { QuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/question-theme/question-theme.controller";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/find-question-theme-by-id.use-case.mock";
import { createMockedFindQuestionThemesUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/find-question-themes.use-case.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";
import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeFindQuestionThemesSortQueryDto } from "@faketories/contexts/question/question-theme/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.faketory";

import type { Mock } from "vitest";

import type { SortOptions } from "@shared/domain/types/sort.types";
import type { QuestionThemeSortableField } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

vi.mock(import("@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers"));
vi.mock(import("@shared/application/mappers/sort-query-dto/sort-query-dto.mapper"));

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
      const sortQueryDto = createFakeFindQuestionThemesSortQueryDto();
      const localization = createFakeLocalizationOptions();
      await questionThemeController.findQuestionThemes(sortQueryDto, localization);

      expect(mocks.mappers.createSortOptionsFromSortQueryDto).toHaveBeenCalledExactlyOnceWith(sortQueryDto);
    });

    it("should list all question themes with sort options when called.", async() => {
      const sortQueryDto = createFakeFindQuestionThemesSortQueryDto();
      const localization = createFakeLocalizationOptions();
      const expectedSortOptions: SortOptions<QuestionThemeSortableField> = { sortBy: "createdAt", sortOrder: "desc" };
      mocks.mappers.createSortOptionsFromSortQueryDto.mockReturnValueOnce(expectedSortOptions);
      await questionThemeController.findQuestionThemes(sortQueryDto, localization);

      expect(mocks.useCases.findQuestionThemes.list).toHaveBeenCalledExactlyOnceWith(expectedSortOptions);
    });

    it("should map every question theme to dto when called.", async() => {
      const sortQueryDto = createFakeFindQuestionThemesSortQueryDto();
      const localization = createFakeLocalizationOptions();
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      await questionThemeController.findQuestionThemes(sortQueryDto, localization);

      expect(mocks.mappers.createQuestionThemeDtoFromEntity).toHaveBeenCalledTimes(questionThemes.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const sortQueryDto = createFakeFindQuestionThemesSortQueryDto();
      const localization = createFakeLocalizationOptions();
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.useCases.findQuestionThemes.list.mockResolvedValueOnce(questionThemes);
      await questionThemeController.findQuestionThemes(sortQueryDto, localization);

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