import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";
import { createQuestionThemeCreationCommandFromDto } from "@question/modules/question-theme/application/mappers/question-theme-creation/question-theme-creation.dto.mappers";
import { createQuestionThemeModificationCommandFromDto } from "@question/modules/question-theme/application/mappers/question-theme-modification/question-theme-modification.dto.mappers";
import { createAdminQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import { ArchiveQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { CreateQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { FindQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { ModifyQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/modify-question-theme/modify-question-theme.use-case";
import { AdminQuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedModifyQuestionThemeUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/modify-question-theme.use-case.mock";
import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/find-question-theme-by-id.use-case.mock";
import { createMockedFindQuestionThemesUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/find-question-themes.use-case.mock";
import { createMockedCreateQuestionThemeUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/create-question-theme.use-case.mock";
import { createMockedArchiveQuestionThemeUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/archive-question-theme.use-case.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeAdminQuestionThemeDto, createFakeQuestionThemeCreationDto, createFakeQuestionThemeModificationDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";
import { createFakeQuestionThemeCreationCommand, createFakeQuestionThemeModificationCommand } from "@faketories/contexts/question/question-theme/commands/question-theme.commands.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers"));
vi.mock(import("@question/modules/question-theme/application/mappers/question-theme-creation/question-theme-creation.dto.mappers"));
vi.mock(import("@question/modules/question-theme/application/mappers/question-theme-modification/question-theme-modification.dto.mappers"));

describe("Admin Question Theme Controller", () => {
  let adminQuestionThemeController: AdminQuestionThemeController;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    useCases: {
      findQuestionThemes: ReturnType<typeof createMockedFindQuestionThemesUseCase>;
      findQuestionThemeById: ReturnType<typeof createMockedFindQuestionThemeByIdUseCase>;
      createQuestionTheme: ReturnType<typeof createMockedCreateQuestionThemeUseCase>;
      modifyQuestionTheme: ReturnType<typeof createMockedModifyQuestionThemeUseCase>;
      archiveQuestionTheme: ReturnType<typeof createMockedArchiveQuestionThemeUseCase>;
    };
    mappers: {
      createAdminQuestionThemeDtoFromEntity: Mock;
      createQuestionThemeCreationCommandFromDto: Mock;
      createQuestionThemeModificationCommandFromDto: Mock;
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
        createQuestionTheme: createMockedCreateQuestionThemeUseCase(),
        modifyQuestionTheme: createMockedModifyQuestionThemeUseCase(),
        archiveQuestionTheme: createMockedArchiveQuestionThemeUseCase(),
      },
      mappers: {
        createAdminQuestionThemeDtoFromEntity: vi.mocked(createAdminQuestionThemeDtoFromEntity),
        createQuestionThemeCreationCommandFromDto: vi.mocked(createQuestionThemeCreationCommandFromDto),
        createQuestionThemeModificationCommandFromDto: vi.mocked(createQuestionThemeModificationCommandFromDto),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [AdminQuestionThemeController],
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
        {
          provide: CreateQuestionThemeUseCase,
          useValue: mocks.useCases.createQuestionTheme,
        },
        {
          provide: ModifyQuestionThemeUseCase,
          useValue: mocks.useCases.modifyQuestionTheme,
        },
        {
          provide: ArchiveQuestionThemeUseCase,
          useValue: mocks.useCases.archiveQuestionTheme,
        },
      ],
    }).compile();

    adminQuestionThemeController = testingModule.get<AdminQuestionThemeController>(AdminQuestionThemeController);
  });

  describe(AdminQuestionThemeController.prototype.findQuestionThemes, () => {
    it("should list all question themes when called.", async() => {
      await adminQuestionThemeController.findQuestionThemes();

      expect(mocks.useCases.findQuestionThemes.list).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map every question theme to admin dto when called.", async() => {
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      await adminQuestionThemeController.findQuestionThemes();

      expect(mocks.mappers.createAdminQuestionThemeDtoFromEntity).toHaveBeenCalledTimes(questionThemes.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const questionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.useCases.findQuestionThemes.list.mockResolvedValueOnce(questionThemes);
      await adminQuestionThemeController.findQuestionThemes();

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

  describe(AdminQuestionThemeController.prototype.createQuestionTheme, () => {
    it("should map question theme creation dto to question theme creation command when called.", async() => {
      const questionThemeCreationDto = createFakeQuestionThemeCreationDto();
      await adminQuestionThemeController.createQuestionTheme(questionThemeCreationDto);

      expect(mocks.mappers.createQuestionThemeCreationCommandFromDto).toHaveBeenCalledExactlyOnceWith(questionThemeCreationDto);
    });

    it("should create question theme when called.", async() => {
      const questionThemeCreationDto = createFakeQuestionThemeCreationDto();
      const questionThemeCreationCommand = createFakeQuestionThemeCreationCommand();
      mocks.mappers.createQuestionThemeCreationCommandFromDto.mockReturnValueOnce(questionThemeCreationCommand);
      await adminQuestionThemeController.createQuestionTheme(questionThemeCreationDto);

      expect(mocks.useCases.createQuestionTheme.create).toHaveBeenCalledExactlyOnceWith(questionThemeCreationCommand);
    });

    it("should map the created question theme to dto when created.", async() => {
      const questionThemeCreationDto = createFakeQuestionThemeCreationDto();
      const createdQuestionTheme = createFakeQuestionTheme();
      mocks.useCases.createQuestionTheme.create.mockResolvedValueOnce(createdQuestionTheme);
      await adminQuestionThemeController.createQuestionTheme(questionThemeCreationDto);

      expect(mocks.mappers.createAdminQuestionThemeDtoFromEntity).toHaveBeenCalledExactlyOnceWith(createdQuestionTheme);
    });

    it("should return the mapped dto from the mapper when created.", async() => {
      const questionThemeCreationDto = createFakeQuestionThemeCreationDto();
      const createdQuestionTheme = createFakeQuestionTheme();
      const expectedDto = createFakeAdminQuestionThemeDto();

      mocks.useCases.createQuestionTheme.create.mockResolvedValueOnce(createdQuestionTheme);
      mocks.mappers.createAdminQuestionThemeDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await adminQuestionThemeController.createQuestionTheme(questionThemeCreationDto);

      expect(result).toStrictEqual<AdminQuestionThemeDto>(expectedDto);
    });
  });

  describe(AdminQuestionThemeController.prototype.patchQuestionTheme, () => {
    it("should map question theme modification dto to update command when called.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationDto = createFakeQuestionThemeModificationDto({ slug: "new-slug" });
      await adminQuestionThemeController.patchQuestionTheme(questionThemeId, questionThemeModificationDto);

      expect(mocks.mappers.createQuestionThemeModificationCommandFromDto).toHaveBeenCalledExactlyOnceWith(questionThemeId, questionThemeModificationDto);
    });

    it("should update question theme when called.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationDto = createFakeQuestionThemeModificationDto({ slug: "new-slug" });
      const mappedUpdateCommand = createFakeQuestionThemeModificationCommand();
      mocks.mappers.createQuestionThemeModificationCommandFromDto.mockReturnValueOnce(mappedUpdateCommand);
      await adminQuestionThemeController.patchQuestionTheme(questionThemeId, questionThemeModificationDto);

      expect(mocks.useCases.modifyQuestionTheme.modify).toHaveBeenCalledExactlyOnceWith(mappedUpdateCommand);
    });

    it("should map the updated question theme to dto when updated.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationDto = createFakeQuestionThemeModificationDto({
        slug: "new-slug",
      });
      const updatedQuestionTheme = createFakeQuestionTheme();
      mocks.useCases.modifyQuestionTheme.modify.mockResolvedValueOnce(updatedQuestionTheme);
      await adminQuestionThemeController.patchQuestionTheme(questionThemeId, questionThemeModificationDto);

      expect(mocks.mappers.createAdminQuestionThemeDtoFromEntity).toHaveBeenCalledExactlyOnceWith(updatedQuestionTheme);
    });

    it("should return the mapped dto from the mapper when updated.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationDto = createFakeQuestionThemeModificationDto({
        slug: "new-slug",
      });
      const updatedQuestionTheme = createFakeQuestionTheme();
      const expectedDto = createFakeAdminQuestionThemeDto();

      mocks.useCases.modifyQuestionTheme.modify.mockResolvedValueOnce(updatedQuestionTheme);
      mocks.mappers.createAdminQuestionThemeDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await adminQuestionThemeController.patchQuestionTheme(questionThemeId, questionThemeModificationDto);

      expect(result).toStrictEqual<AdminQuestionThemeDto>(expectedDto);
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
      const expectedDto = createFakeAdminQuestionThemeDto();

      mocks.useCases.archiveQuestionTheme.archive.mockResolvedValueOnce(archivedQuestionTheme);
      mocks.mappers.createAdminQuestionThemeDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await adminQuestionThemeController.archiveQuestionTheme(questionThemeId);

      expect(result).toStrictEqual<AdminQuestionThemeDto>(expectedDto);
    });
  });
});