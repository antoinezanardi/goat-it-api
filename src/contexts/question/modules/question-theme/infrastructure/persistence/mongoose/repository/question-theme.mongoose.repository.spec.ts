import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseRepository } from "@question/modules/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository";
import { QuestionThemeMongooseSchema } from "@question/modules/question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

import { createMockedQuestionThemeMongooseModel } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.model.mock";

import { createFakeQuestionTheme, createFakeQuestionThemeDocument, createFakeQuestionThemeDraft } from "@faketories/contexts/question/question-theme/question-theme.faketory";

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

  describe("findAll", () => {
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

  describe("findById", () => {
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

  describe("create", () => {
    it("should create document in model when called.", async() => {
      const questionThemeToCreate = createFakeQuestionThemeDraft();
      await repositories.questionTheme.create(questionThemeToCreate);

      expect(mocks.models.questionTheme.create).toHaveBeenCalledExactlyOnceWith(questionThemeToCreate);
    });

    it("should map and return created question theme when called.", async() => {
      const questionThemeToCreate = createFakeQuestionThemeDraft();
      const createdQuestionThemeDocument = createFakeQuestionThemeDocument();
      mocks.models.questionTheme.create.mockResolvedValue(createdQuestionThemeDocument);
      await repositories.questionTheme.create(questionThemeToCreate);

      expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledExactlyOnceWith(createdQuestionThemeDocument);
    });

    it("should return created question theme when called.", async() => {
      const questionThemeToCreate = createFakeQuestionThemeDraft();
      const createdQuestionTheme = createFakeQuestionTheme();
      const createdQuestionThemeDocument = createFakeQuestionThemeDocument();
      mocks.models.questionTheme.create.mockResolvedValue(createdQuestionThemeDocument);
      mocks.mappers.questionTheme.createQuestionThemeFromDocument.mockReturnValue(createdQuestionTheme);
      const actualQuestionTheme = await repositories.questionTheme.create(questionThemeToCreate);

      expect(actualQuestionTheme).toStrictEqual<QuestionTheme>(createdQuestionTheme);
    });
  });

  describe("archive", () => {
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