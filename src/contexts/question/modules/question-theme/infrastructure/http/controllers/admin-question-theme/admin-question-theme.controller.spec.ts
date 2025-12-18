import { Test } from "@nestjs/testing";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";
import { createAdminQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import { ArchiveQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { AdminQuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller";

import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-question-theme-by-id.use-case.mock";
import { createMockedFindAllQuestionThemesUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-all-question-themes.use-case.mock";
import { createMockedArchiveQuestionThemeUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/archive-question-theme.use-case.mock";

import { createFakeQuestionTheme, createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers"));

describe("Admin Question Theme Controller", () => {
  let adminQuestionThemeController: AdminQuestionThemeController;
  let mocks: {
    useCases: {
      findAllQuestionThemes: ReturnType<typeof createMockedFindAllQuestionThemesUseCase>;
      findQuestionThemeById: ReturnType<typeof createMockedFindQuestionThemeByIdUseCase>;
      archiveQuestionTheme: ReturnType<typeof createMockedArchiveQuestionThemeUseCase>;
    };
    mappers: {
      createAdminQuestionThemeDtoFromEntity: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      useCases: {
        findAllQuestionThemes: createMockedFindAllQuestionThemesUseCase(),
        findQuestionThemeById: createMockedFindQuestionThemeByIdUseCase(),
        archiveQuestionTheme: createMockedArchiveQuestionThemeUseCase(),
      },
      mappers: {
        createAdminQuestionThemeDtoFromEntity: vi.mocked(createAdminQuestionThemeDtoFromEntity),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [AdminQuestionThemeController],
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
          provide: ArchiveQuestionThemeUseCase,
          useValue: mocks.useCases.archiveQuestionTheme,
        },
      ],
    }).compile();

    adminQuestionThemeController = testingModule.get<AdminQuestionThemeController>(AdminQuestionThemeController);
  });

  describe(AdminQuestionThemeController.prototype.findAllQuestionThemes, () => {
    it("should list all question themes when called.", async() => {
      await adminQuestionThemeController.findAllQuestionThemes();

      expect(mocks.useCases.findAllQuestionThemes.list).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map every question theme to admin dto when called.", async() => {
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      await adminQuestionThemeController.findAllQuestionThemes();

      expect(mocks.mappers.createAdminQuestionThemeDtoFromEntity).toHaveBeenCalledTimes(questionThemes.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.useCases.findAllQuestionThemes.list.mockResolvedValueOnce(questionThemes);
      await adminQuestionThemeController.findAllQuestionThemes();

      expect(mocks.mappers.createAdminQuestionThemeDtoFromEntity).toHaveBeenCalledWith(questionThemes[0]);
    });
  });

  describe(AdminQuestionThemeController.prototype.findQuestionThemeById, () => {
    it("should get question theme by ID when called.", async() => {
      const questionThemeId = "question-theme-id-123";
      await adminQuestionThemeController.findQuestionThemeById(questionThemeId);

      expect(mocks.useCases.findQuestionThemeById.getById).toHaveBeenCalledExactlyOnceWith(questionThemeId);
    });

    it("should map the question theme to admin dto when called.", async() => {
      const questionTheme = createFakeQuestionTheme();
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValueOnce(questionTheme);
      const questionThemeId = "question-theme-id-123";
      await adminQuestionThemeController.findQuestionThemeById(questionThemeId);

      expect(mocks.mappers.createAdminQuestionThemeDtoFromEntity).toHaveBeenCalledExactlyOnceWith(questionTheme);
    });
  });

  describe(AdminQuestionThemeController.prototype.archiveQuestionTheme, () => {
    it("should archive question theme by id when called.", async() => {
      const questionThemeId = "question-theme-id";
      await adminQuestionThemeController.archiveQuestionTheme(questionThemeId);

      expect(mocks.useCases.archiveQuestionTheme.archive).toHaveBeenCalledExactlyOnceWith(questionThemeId);
    });

    it("should map the archived question theme to dto when called.", async() => {
      const questionThemeId = "question-theme-id";
      const archivedQuestionTheme = createFakeQuestionTheme();
      mocks.useCases.archiveQuestionTheme.archive.mockResolvedValueOnce(archivedQuestionTheme);
      await adminQuestionThemeController.archiveQuestionTheme(questionThemeId);

      expect(mocks.mappers.createAdminQuestionThemeDtoFromEntity).toHaveBeenCalledExactlyOnceWith(archivedQuestionTheme);
    });

    it("should return the mapped dto from the mapper when archived.", async() => {
      const questionThemeId = "question-theme-id";
      const archivedQuestionTheme = createFakeQuestionTheme();
      const expectedDto = createFakeQuestionThemeDto();

      mocks.useCases.archiveQuestionTheme.archive.mockResolvedValueOnce(archivedQuestionTheme);
      mocks.mappers.createAdminQuestionThemeDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await adminQuestionThemeController.archiveQuestionTheme(questionThemeId);

      expect(result).toStrictEqual<QuestionThemeDto>(expectedDto);
    });
  });
});