import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createQuestionCreationCommandFromDto } from "@question/application/mappers/question-creation/question-creation.dto.mappers";
import { FindAllQuestionsUseCase } from "@question/application/use-cases/find-all-questions/find-all-questions.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";
import { createAdminQuestionDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedFindAllQuestionsUseCase } from "@mocks/contexts/question/application/use-cases/find-all-questions.use-case.mock";
import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";
import { createMockedCreateQuestionUseCase } from "@mocks/contexts/question/application/use-cases/create-question.use-case.mock";

import { createFakeAdminQuestionDto } from "@faketories/contexts/question/dto/admin-question/admin-question.dto.faketory";
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionCreationDto } from "@faketories/contexts/question/dto/question-creation/question-creation.dto.faketory";
import { createFakeQuestionCreationCommand } from "@faketories/contexts/question/commands/question.commands.faketory";

import type { Mock } from "vitest";

vi.mock(import("@question/application/mappers/question/question.dto.mappers"));
vi.mock(import("@question/application/mappers/question-creation/question-creation.dto.mappers"));

describe("Admin Question Controller", () => {
  let adminQuestionController: AdminQuestionController;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    useCases: {
      findAllQuestions: ReturnType<typeof createMockedFindAllQuestionsUseCase>;
      findQuestionById: ReturnType<typeof createMockedFindQuestionByIdUseCase>;
      createQuestion: ReturnType<typeof createMockedCreateQuestionUseCase>;
    };
    mappers: {
      createAdminQuestionDtoFromEntity: Mock;
      createQuestionCreationCommandFromDto: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService(),
      },
      useCases: {
        findAllQuestions: createMockedFindAllQuestionsUseCase(),
        findQuestionById: createMockedFindQuestionByIdUseCase(),
        createQuestion: createMockedCreateQuestionUseCase(),
      },
      mappers: {
        createAdminQuestionDtoFromEntity: vi.mocked(createAdminQuestionDtoFromEntity),
        createQuestionCreationCommandFromDto: vi.mocked(createQuestionCreationCommandFromDto),
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
        {
          provide: FindQuestionByIdUseCase,
          useValue: mocks.useCases.findQuestionById,
        },
        {
          provide: CreateQuestionUseCase,
          useValue: mocks.useCases.createQuestion,
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

  describe(AdminQuestionController.prototype.findQuestionById, () => {
    it("should get question by id when called.", async() => {
      const questionId = "123";
      await adminQuestionController.findQuestionById(questionId);

      expect(mocks.useCases.findQuestionById.getById).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should map the question to admin dto when called.", async() => {
      const questionId = "123";
      const question = createFakeQuestion();
      mocks.useCases.findQuestionById.getById.mockResolvedValueOnce(question);
      await adminQuestionController.findQuestionById(questionId);

      expect(mocks.mappers.createAdminQuestionDtoFromEntity).toHaveBeenCalledExactlyOnceWith(question);
    });

    it("should return the mapped dto when called.", async() => {
      const questionId = "123";
      const question = createFakeQuestion();
      mocks.useCases.findQuestionById.getById.mockResolvedValueOnce(question);
      const expectedDto = createFakeAdminQuestionDto();
      mocks.mappers.createAdminQuestionDtoFromEntity.mockReturnValueOnce(expectedDto);

      const result = await adminQuestionController.findQuestionById(questionId);

      expect(result).toStrictEqual<AdminQuestionDto>(expectedDto);
    });
  });

  describe(AdminQuestionController.prototype.createQuestion, () => {
    it("should map question creation dto to command when called.", async() => {
      const questionCreationDto = createFakeQuestionCreationDto();
      await adminQuestionController.createQuestion(questionCreationDto);

      expect(mocks.mappers.createQuestionCreationCommandFromDto).toHaveBeenCalledExactlyOnceWith(questionCreationDto);
    });

    it("should create question when called.", async() => {
      const questionCreationDto = createFakeQuestionCreationDto();
      const questionCreationCommand = createFakeQuestionCreationCommand();
      mocks.mappers.createQuestionCreationCommandFromDto.mockReturnValueOnce(questionCreationCommand);
      await adminQuestionController.createQuestion(questionCreationDto);

      expect(mocks.useCases.createQuestion.create).toHaveBeenCalledExactlyOnceWith(questionCreationCommand);
    });

    it("should map the created question to dto when created.", async() => {
      const questionCreationDto = createFakeQuestionCreationDto();
      const createdQuestion = createFakeQuestion();
      mocks.useCases.createQuestion.create.mockResolvedValueOnce(createdQuestion);
      await adminQuestionController.createQuestion(questionCreationDto);

      expect(mocks.mappers.createAdminQuestionDtoFromEntity).toHaveBeenCalledExactlyOnceWith(createdQuestion);
    });

    it("should return the mapped dto from the mapper when created.", async() => {
      const questionCreationDto = createFakeQuestionCreationDto();
      const createdQuestion = createFakeQuestion();
      const expectedDto = createFakeAdminQuestionDto();

      mocks.useCases.createQuestion.create.mockResolvedValueOnce(createdQuestion);
      mocks.mappers.createAdminQuestionDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await adminQuestionController.createQuestion(questionCreationDto);

      expect(result).toStrictEqual<AdminQuestionDto>(expectedDto);
    });
  });
});