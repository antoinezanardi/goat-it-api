import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { ArchiveQuestionUseCase } from "@question/application/use-cases/archive-question/archive-question.use-case";
import { createQuestionCreationCommandFromDto } from "@question/application/mappers/question-creation/question-creation.dto.mappers";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";
import { createAdminQuestionDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";

import { createMockedArchiveQuestionUseCase } from "@mocks/contexts/question/application/use-cases/archive-question.use-case.mock";
import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedFindQuestionsUseCase } from "@mocks/contexts/question/application/use-cases/find-questions.use-case.mock";
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
      findQuestions: ReturnType<typeof createMockedFindQuestionsUseCase>;
      findQuestionById: ReturnType<typeof createMockedFindQuestionByIdUseCase>;
      createQuestion: ReturnType<typeof createMockedCreateQuestionUseCase>;
      archiveQuestion: ReturnType<typeof createMockedArchiveQuestionUseCase>;
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
        findQuestions: createMockedFindQuestionsUseCase(),
        findQuestionById: createMockedFindQuestionByIdUseCase(),
        createQuestion: createMockedCreateQuestionUseCase(),
        archiveQuestion: createMockedArchiveQuestionUseCase(),
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
          provide: FindQuestionsUseCase,
          useValue: mocks.useCases.findQuestions,
        },
        {
          provide: FindQuestionByIdUseCase,
          useValue: mocks.useCases.findQuestionById,
        },
        {
          provide: CreateQuestionUseCase,
          useValue: mocks.useCases.createQuestion,
        },
        {
          provide: ArchiveQuestionUseCase,
          useValue: mocks.useCases.archiveQuestion,
        },
      ],
    }).compile();

    adminQuestionController = testingModule.get<AdminQuestionController>(AdminQuestionController);
  });

  describe(AdminQuestionController.prototype.findQuestions, () => {
    it("should list all questions when called.", async() => {
      await adminQuestionController.findQuestions();

      expect(mocks.useCases.findQuestions.list).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map every question to admin dto when called.", async() => {
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findQuestions.list.mockResolvedValueOnce(questions);
      await adminQuestionController.findQuestions();

      expect(mocks.mappers.createAdminQuestionDtoFromEntity).toHaveBeenCalledTimes(questions.length);
    });

    it("should call the mapper with the correct parameters when called.", async() => {
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findQuestions.list.mockResolvedValueOnce(questions);
      await adminQuestionController.findQuestions();

      expect(mocks.mappers.createAdminQuestionDtoFromEntity).toHaveBeenCalledWith(questions[0]);
    });

    it("should return the mapped dtos when called.", async() => {
      const questions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.useCases.findQuestions.list.mockResolvedValueOnce(questions);
      const expectedDtos = [
        createFakeAdminQuestionDto(),
        createFakeAdminQuestionDto(),
      ];
      mocks.mappers.createAdminQuestionDtoFromEntity.mockReturnValueOnce(expectedDtos[0]).mockReturnValueOnce(expectedDtos[1]);
      const result = await adminQuestionController.findQuestions();

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

  describe(AdminQuestionController.prototype.archiveQuestion, () => {
    it("should archive question when called.", async() => {
      const questionId = "archive-id-1";
      await adminQuestionController.archiveQuestion(questionId);

      expect(mocks.useCases.archiveQuestion.archive).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should map the archived question to admin dto when called.", async() => {
      const questionId = "archive-id-2";
      const archivedQuestion = createFakeQuestion();
      mocks.useCases.archiveQuestion.archive.mockResolvedValueOnce(archivedQuestion);
      await adminQuestionController.archiveQuestion(questionId);

      expect(mocks.mappers.createAdminQuestionDtoFromEntity).toHaveBeenCalledExactlyOnceWith(archivedQuestion);
    });

    it("should return the mapped dto when called.", async() => {
      const questionId = "archive-id-3";
      const archivedQuestion = createFakeQuestion();
      const expectedDto = createFakeAdminQuestionDto();

      mocks.useCases.archiveQuestion.archive.mockResolvedValueOnce(archivedQuestion);
      mocks.mappers.createAdminQuestionDtoFromEntity.mockReturnValueOnce(expectedDto);
      const result = await adminQuestionController.archiveQuestion(questionId);

      expect(result).toStrictEqual<AdminQuestionDto>(expectedDto);
    });
  });
});