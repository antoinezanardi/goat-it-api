import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { getCrushedDataForMongoPatchUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseRepository } from "@question/modules/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository";
import { QuestionThemeMongooseSchema } from "@question/modules/question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

import { createMockedQuestionThemeMongooseModel } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.model.mock";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeCreationContract, createFakeQuestionThemeModificationContract } from "@faketories/contexts/question/question-theme/contracts/question-theme.contracts.faketory";

import type { Mock } from "vitest";
import type { TestingModule } from "@nestjs/testing";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

vi.mock(import("@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers"));

describe("Question Theme Mongoose Repository", () => {
  let repositories: { questionTheme: QuestionThemeMongooseRepository };
  let mocks: {
    models: {
      questionTheme: ReturnType<typeof createMockedQuestionThemeMongooseModel>;
    };
    mappers: {
      questionTheme: {
        createQuestionThemeFromDocument: Mock;
      };
    };
  };

  beforeEach(async() => {
    mocks = {
      models: {
        questionTheme: createMockedQuestionThemeMongooseModel(),
      },
      mappers: {
        questionTheme: {
          createQuestionThemeFromDocument: vi.mocked(createQuestionThemeFromDocument),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(QuestionThemeMongooseSchema.name),
          useValue: mocks.models.questionTheme,
        },
        QuestionThemeMongooseRepository,
      ],
    }).compile();

    repositories = { questionTheme: module.get<QuestionThemeMongooseRepository>(QuestionThemeMongooseRepository) };
  });

  describe(QuestionThemeMongooseRepository.prototype.findAll, () => {
    it("should find all documents from model when called.", async() => {
      await repositories.questionTheme.findAll();

      expect(mocks.models.questionTheme.find).toHaveBeenCalledExactlyOnceWith();
    });

    it("should map and return question themes when called.", async() => {
      const questionThemes = await repositories.questionTheme.findAll();

      expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledTimes(questionThemes.length);
    });

    it("should return mapped question themes from model when called.", async() => {
      const expectedQuestionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      vi.mocked(createQuestionThemeFromDocument)
        .mockReturnValueOnce(expectedQuestionThemes[0])
        .mockReturnValueOnce(expectedQuestionThemes[1])
        .mockReturnValueOnce(expectedQuestionThemes[2]);
      const actualQuestionThemes = await repositories.questionTheme.findAll();

      expect(actualQuestionThemes).toStrictEqual<QuestionTheme[]>(expectedQuestionThemes);
    });
  });

  describe(QuestionThemeMongooseRepository.prototype.findById, () => {
    it("should find document by id from model when called.", async() => {
      const questionThemeId = "question-theme-id";
      await repositories.questionTheme.findById(questionThemeId);

      expect(mocks.models.questionTheme.findById).toHaveBeenCalledExactlyOnceWith(questionThemeId);
    });

    it("should map and return question theme when called.", async() => {
      const questionThemeId = "question-theme-id";
      const foundQuestionThemeDocument = createFakeQuestionThemeDocument();
      mocks.models.questionTheme.findById.mockResolvedValue(foundQuestionThemeDocument);
      await repositories.questionTheme.findById(questionThemeId);

      expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledExactlyOnceWith(foundQuestionThemeDocument);
    });

    it("should return undefined when document with given id is not found.", async() => {
      const questionThemeId = "question-theme-id";
      mocks.models.questionTheme.findById.mockResolvedValue(null);
      const actualQuestionTheme = await repositories.questionTheme.findById(questionThemeId);

      expect(actualQuestionTheme).toBeUndefined();
    });
  });

  describe(QuestionThemeMongooseRepository.prototype.findByIds, () => {
    it("should find documents by ids from model when called.", async() => {
      const questionThemeIds: Set<string> = new Set(["question-theme-id-1", "question-theme-id-2"]);
      await repositories.questionTheme.findByIds(questionThemeIds);

      expect(mocks.models.questionTheme.find).toHaveBeenCalledExactlyOnceWith({ _id: { $in: [...questionThemeIds] } });
    });

    it("should map and return question themes when called.", async() => {
      const questionThemeIds: Set<string> = new Set(["question-theme-id-1", "question-theme-id-2"]);
      const foundQuestionThemeDocuments = [
        createFakeQuestionThemeDocument(),
        createFakeQuestionThemeDocument(),
      ];
      mocks.models.questionTheme.find.mockResolvedValue(foundQuestionThemeDocuments);
      await repositories.questionTheme.findByIds(questionThemeIds);

      expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledTimes(foundQuestionThemeDocuments.length);
    });

    it("should return mapped question themes from model when called.", async() => {
      const questionThemeIds: Set<string> = new Set([
        "question-theme-id-1",
        "question-theme-id-2",
        "question-theme-id-3",
      ]);
      const expectedQuestionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      vi.mocked(createQuestionThemeFromDocument)
        .mockReturnValueOnce(expectedQuestionThemes[0])
        .mockReturnValueOnce(expectedQuestionThemes[1])
        .mockReturnValueOnce(expectedQuestionThemes[2]);
      const actualQuestionThemes = await repositories.questionTheme.findByIds(questionThemeIds);

      expect(actualQuestionThemes).toStrictEqual<QuestionTheme[]>(expectedQuestionThemes);
    });
  });

  describe(QuestionThemeMongooseRepository.prototype.findBySlug, () => {
    it("should find document by slug from model when called.", async() => {
      const questionThemeSlug = "question-theme-slug";
      await repositories.questionTheme.findBySlug(questionThemeSlug);

      expect(mocks.models.questionTheme.findOne).toHaveBeenCalledExactlyOnceWith({ slug: questionThemeSlug });
    });

    it("should map and return question theme when called.", async() => {
      const questionThemeSlug = "question-theme-slug";
      const foundQuestionThemeDocument = createFakeQuestionThemeDocument();
      mocks.models.questionTheme.findOne.mockResolvedValue(foundQuestionThemeDocument);
      await repositories.questionTheme.findBySlug(questionThemeSlug);

      expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledExactlyOnceWith(foundQuestionThemeDocument);
    });

    it("should return undefined when document with given slug is not found.", async() => {
      const questionThemeSlug = "question-theme-slug";
      mocks.models.questionTheme.findOne.mockResolvedValue(null);
      const actualQuestionTheme = await repositories.questionTheme.findBySlug(questionThemeSlug);

      expect(actualQuestionTheme).toBeUndefined();
    });
  });

  describe(QuestionThemeMongooseRepository.prototype.create, () => {
    it("should create document in model when called.", async() => {
      const questionThemeCreationContract = createFakeQuestionThemeCreationContract();
      await repositories.questionTheme.create(questionThemeCreationContract);

      expect(mocks.models.questionTheme.create).toHaveBeenCalledExactlyOnceWith(questionThemeCreationContract);
    });

    it("should map and return created question theme when called.", async() => {
      const questionThemeCreationContract = createFakeQuestionThemeCreationContract();
      const createdQuestionThemeDocument = createFakeQuestionThemeDocument();
      mocks.models.questionTheme.create.mockResolvedValue(createdQuestionThemeDocument);
      await repositories.questionTheme.create(questionThemeCreationContract);

      expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledExactlyOnceWith(createdQuestionThemeDocument);
    });

    it("should return created question theme when called.", async() => {
      const questionThemeCreationContract = createFakeQuestionThemeCreationContract();
      const createdQuestionTheme = createFakeQuestionTheme();
      const createdQuestionThemeDocument = createFakeQuestionThemeDocument();
      mocks.models.questionTheme.create.mockResolvedValue(createdQuestionThemeDocument);
      mocks.mappers.questionTheme.createQuestionThemeFromDocument.mockReturnValue(createdQuestionTheme);
      const actualQuestionTheme = await repositories.questionTheme.create(questionThemeCreationContract);

      expect(actualQuestionTheme).toStrictEqual<QuestionTheme>(createdQuestionTheme);
    });
  });

  describe(QuestionThemeMongooseRepository.prototype.modify, () => {
    it("should modify document in model when called.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationContract = createFakeQuestionThemeModificationContract();
      const updateQuery = {
        $set: getCrushedDataForMongoPatchUpdate(questionThemeModificationContract),
      };
      await repositories.questionTheme.modify(questionThemeId, questionThemeModificationContract);

      expect(mocks.models.questionTheme.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(
        questionThemeId,
        updateQuery,
        { new: true },
      );
    });

    it("should map and return modified question theme when called.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationContract = createFakeQuestionThemeModificationContract();
      const modifiedQuestionThemeDocument = createFakeQuestionThemeDocument();
      mocks.models.questionTheme.findByIdAndUpdate.mockResolvedValue(modifiedQuestionThemeDocument);
      await repositories.questionTheme.modify(questionThemeId, questionThemeModificationContract);

      expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledExactlyOnceWith(modifiedQuestionThemeDocument);
    });

    it("should return modified question theme when called.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationContract = createFakeQuestionThemeModificationContract();
      const modifiedQuestionThemeDocument = createFakeQuestionThemeDocument();
      const modifiedQuestionTheme = createFakeQuestionTheme();
      mocks.models.questionTheme.findByIdAndUpdate.mockResolvedValue(modifiedQuestionThemeDocument);
      mocks.mappers.questionTheme.createQuestionThemeFromDocument.mockReturnValue(modifiedQuestionTheme);
      const actualQuestionTheme = await repositories.questionTheme.modify(questionThemeId, questionThemeModificationContract);

      expect(actualQuestionTheme).toStrictEqual<QuestionTheme>(modifiedQuestionTheme);
    });

    it("should return undefined when document to modify is not found.", async() => {
      const questionThemeId = "question-theme-id";
      const questionThemeModificationContract = createFakeQuestionThemeModificationContract();
      mocks.models.questionTheme.findByIdAndUpdate.mockResolvedValue(null);
      const actualQuestionTheme = await repositories.questionTheme.modify(questionThemeId, questionThemeModificationContract);

      expect(actualQuestionTheme).toBeUndefined();
    });
  });

  describe(QuestionThemeMongooseRepository.prototype.archive, () => {
    it("should update document status to archived in model when called.", async() => {
      const questionThemeId = "question-theme-id";
      await repositories.questionTheme.archive(questionThemeId);

      expect(mocks.models.questionTheme.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionThemeId, { status: "archived" }, { new: true });
    });

    it("should return update and map question theme when called.", async() => {
      const questionThemeId = "question-theme-id";
      const updatedQuestionThemeDocument = createFakeQuestionThemeDocument();
      const updatedQuestionTheme = createFakeQuestionTheme();
      mocks.models.questionTheme.findByIdAndUpdate.mockResolvedValue(updatedQuestionThemeDocument);
      mocks.mappers.questionTheme.createQuestionThemeFromDocument.mockReturnValue(updatedQuestionTheme);
      const actualQuestionTheme = await repositories.questionTheme.archive(questionThemeId);

      expect(actualQuestionTheme).toStrictEqual<QuestionTheme>(updatedQuestionTheme);
    });

    it("should return undefined when document to archive is not found.", async() => {
      const questionThemeId = "question-theme-id";
      mocks.models.questionTheme.findByIdAndUpdate.mockResolvedValue(null);
      const actualQuestionTheme = await repositories.questionTheme.archive(questionThemeId);

      expect(actualQuestionTheme).toBeUndefined();
    });
  });
});