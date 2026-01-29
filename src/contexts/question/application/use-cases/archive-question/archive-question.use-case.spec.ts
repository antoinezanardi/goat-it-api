import { Test } from "@nestjs/testing";

import { ArchiveQuestionUseCase } from "@question/application/use-cases/archive-question/archive-question.use-case";
import { QuestionAlreadyArchivedError, QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Question } from "@question/domain/entities/question.types";

describe("Archive Question Use Case", () => {
  let archiveQuestionUseCase: ArchiveQuestionUseCase;
  let mocks: { repositories: { question: ReturnType<typeof createMockedQuestionRepository> } };

  beforeEach(async() => {
    mocks = { repositories: { question: createMockedQuestionRepository() } };

    const testingModule = await Test.createTestingModule({
      providers: [
        ArchiveQuestionUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    archiveQuestionUseCase = testingModule.get<ArchiveQuestionUseCase>(ArchiveQuestionUseCase);
  });

  describe(ArchiveQuestionUseCase.prototype.archive, () => {
    beforeEach(() => {
      mocks.repositories.question.findById.mockResolvedValue(createFakeQuestion({ status: "active" }));
    });

    it("should call repository.archive when called.", async() => {
      const id = "question-id-1";

      await archiveQuestionUseCase.archive(id);

      expect(mocks.repositories.question.archive).toHaveBeenCalledExactlyOnceWith(id);
    });

    it("should throw QuestionNotFoundError when repository.archive returns undefined.", async() => {
      const id = "question-id-2";
      mocks.repositories.question.archive.mockResolvedValueOnce(undefined);

      await expect(archiveQuestionUseCase.archive(id)).rejects.toThrowError(new QuestionNotFoundError(id));
    });

    it("should return archived question when called.", async() => {
      const id = "question-id-3";
      const archived = createFakeQuestion({ id, status: "archived" });
      mocks.repositories.question.archive.mockResolvedValueOnce(archived);

      const result = await archiveQuestionUseCase.archive(id);

      expect(result).toStrictEqual<Question>(archived);
    });
  });

  describe("throwIfQuestionNotArchivable", () => {
    it("should throw QuestionNotFoundError when question is not found.", async() => {
      const id = "non-existent-question-id";
      mocks.repositories.question.findById.mockResolvedValueOnce(undefined);

      await expect(archiveQuestionUseCase["throwIfQuestionNotArchivable"](id)).rejects.toThrowError(new QuestionNotFoundError(id));
    });

    it("should throw QuestionAlreadyArchivedError when question is already archived.", async() => {
      const id = "archived-question-id";
      mocks.repositories.question.findById.mockResolvedValueOnce(createFakeQuestion({ id, status: "archived" }));
      const expectedError = new QuestionAlreadyArchivedError(id);

      await expect(archiveQuestionUseCase["throwIfQuestionNotArchivable"](id)).rejects.toThrowError(expectedError);
    });

    it("should not throw any error when question is archivable.", async() => {
      const id = "active-question-id";
      mocks.repositories.question.findById.mockResolvedValueOnce(createFakeQuestion({ id, status: "active" }));

      await expect(archiveQuestionUseCase["throwIfQuestionNotArchivable"](id)).resolves.not.toThrowError();
    });
  });
});