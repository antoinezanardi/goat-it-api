import { Test } from "@nestjs/testing";

import { createAdminQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { AdminQuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller";

import { createMockedFindAllQuestionThemesUseCase } from "@mocks/contexts/question/modules/question-theme/application/uses-cases/find-all-question-themes.use-case.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers"));

describe("Admin Question Theme Controller", () => {
  let adminQuestionThemeController: AdminQuestionThemeController;
  let mocks: {
    useCases: {
      findAllQuestionThemes: ReturnType<typeof createMockedFindAllQuestionThemesUseCase>;
    };
    mappers: {
      createAdminQuestionThemeDtoFromEntity: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      useCases: {
        findAllQuestionThemes: createMockedFindAllQuestionThemesUseCase(),
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
});