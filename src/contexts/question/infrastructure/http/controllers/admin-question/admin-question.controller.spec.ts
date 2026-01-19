import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { FindAllQuestionsUseCase } from "@question/application/use-cases/find-all-questions/find-all-questions.use-case";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";
import { createAdminQuestionDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedFindAllQuestionsUseCase } from "@mocks/contexts/question/application/use-cases/find-all-questions.use-case.mock";

import { createFakeAdminQuestionDto } from "@faketories/contexts/question/dto/admin-question/admin-question.dto.faketory";
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/application/mappers/question/question.dto.mappers"));

describe("Admin Question Controller", () => {
  let adminQuestionController: AdminQuestionController;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    useCases: {
      findAllQuestions: ReturnType<typeof createMockedFindAllQuestionsUseCase>;
    };
    mappers: {
      createAdminQuestionDtoFromEntity: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService(),
      },
      useCases: {
        findAllQuestions: createMockedFindAllQuestionsUseCase(),
      },
      mappers: {
        createAdminQuestionDtoFromEntity: vi.mocked(createAdminQuestionDtoFromEntity),
      },
    };

    const testingModule = await Test.createTestingModule({
      controllers: [AdminQuestionController],
      providers: [
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
        {
          provide: FindAllQuestionsUseCase,
          useValue: mocks.useCases.findAllQuestions,
        },
      ],
    }).compile();

    adminQuestionController = testingModule.get<AdminQuestionController>(AdminQuestionController);
  });

  describe(AdminQuestionController.prototype.findAllQuestions, () => {
    it("should list all questions when called.", async() => {
      await adminQuestionController.findAllQuestions();

      expect(mocks.useCases.findAllQuestions.list).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map every question to admin dto when called.", async() => {
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findAllQuestions.list.mockResolvedValueOnce(questions);
      await adminQuestionController.findAllQuestions();

      expect(mocks.mappers.createAdminQuestionDtoFromEntity).toHaveBeenCalledTimes(questions.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findAllQuestions.list.mockResolvedValueOnce(questions);
      await adminQuestionController.findAllQuestions();

      expect(mocks.mappers.createAdminQuestionDtoFromEntity).toHaveBeenCalledWith(questions[0]);
    });

    it("should return the mapped dtos when called.", async() => {
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findAllQuestions.list.mockResolvedValueOnce(questions);
      const expectedDtos = [
        createFakeAdminQuestionDto(),
        createFakeAdminQuestionDto(),
      ];
      mocks.mappers.createAdminQuestionDtoFromEntity.mockReturnValueOnce(expectedDtos[0]).mockReturnValueOnce(expectedDtos[1]);
      const result = await adminQuestionController.findAllQuestions();

      expect(result).toStrictEqual<AdminQuestionDto[]>(expectedDtos);
    });
  });
});