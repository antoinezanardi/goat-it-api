import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { createQuestionThemeFromDocument } from "@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";
import { QuestionThemeMongooseRepository } from "@question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";
import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";

import { getCrushedDataForMongoPatchUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

import { createMockedQuestionThemeMongooseModel, createQuestionThemeMongooseFindQuery } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.model.mock";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeCreationContract, createFakeQuestionThemeModificationContract } from "@faketories/contexts/question-theme/contracts/question-theme.contracts.faketory";
import { createFakeFindAllOptions } from "@faketories/shared/domain/find-all-options.faketory";

import type { Mock } from "vitest";
import type { TestingModule } from "@nestjs/testing";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { QuestionThemeStatsAggregationResult } from "@question-theme/infrastructure/persistence/mongoose/types/question-theme.mongoose.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

vi.mock(import("@question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers"));

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
    let findAllOptions: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>;

    beforeEach(() => {
      findAllOptions = createFakeFindAllOptions(ADMIN_QUESTION_THEME_SORTABLE_FIELDS);
    });

    it("should find all documents from model when called.", async() => {
      await repositories.questionTheme.findAll(findAllOptions);

      expect(mocks.models.questionTheme.find).toHaveBeenCalledExactlyOnceWith({});
    });

    it("should find documents with filter query from model when filters are provided.", async() => {
      findAllOptions = createFakeFindAllOptions(ADMIN_QUESTION_THEME_SORTABLE_FIELDS, { filters: { status: "active" } });
      await repositories.questionTheme.findAll(findAllOptions);

      expect(mocks.models.questionTheme.find).toHaveBeenCalledExactlyOnceWith({ status: "active" });
    });

    it("should sort in ascending direction when sort order is asc.", async() => {
      findAllOptions = { sort: { ...findAllOptions.sort, sortOrder: "asc" } };
      await repositories.questionTheme.findAll(findAllOptions);

      expect(mocks.models.questionTheme.findQuery.sort).toHaveBeenCalledExactlyOnceWith({ [findAllOptions.sort.sortBy]: 1, _id: 1 });
    });

    it("should sort in descending direction when sort order is desc.", async() => {
      findAllOptions = { sort: { ...findAllOptions.sort, sortOrder: "desc" } };
      await repositories.questionTheme.findAll(findAllOptions);

      expect(mocks.models.questionTheme.findQuery.sort).toHaveBeenCalledExactlyOnceWith({ [findAllOptions.sort.sortBy]: -1, _id: -1 });
    });

    it("should map and return question themes when called.", async() => {
      const questionThemes = await repositories.questionTheme.findAll(findAllOptions);

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
      const actualQuestionThemes = await repositories.questionTheme.findAll(findAllOptions);

      expect(actualQuestionThemes).toStrictEqual(expectedQuestionThemes);
    });

    it("should not apply limit to find query when limit is not set.", async() => {
      findAllOptions = createFakeFindAllOptions(ADMIN_QUESTION_THEME_SORTABLE_FIELDS, { limit: undefined });
      await repositories.questionTheme.findAll(findAllOptions);

      expect(mocks.models.questionTheme.findQuery.limit).not.toHaveBeenCalled();
    });

    it("should apply limit to find query when limit is set.", async() => {
      findAllOptions = createFakeFindAllOptions(ADMIN_QUESTION_THEME_SORTABLE_FIELDS, { limit: 5 });
      await repositories.questionTheme.findAll(findAllOptions);

      expect(mocks.models.questionTheme.findQuery.limit).toHaveBeenCalledExactlyOnceWith(5);
    });

    it("should not apply limit to find query when limit is 0 (unlimited).", async() => {
      findAllOptions = createFakeFindAllOptions(ADMIN_QUESTION_THEME_SORTABLE_FIELDS, { limit: 0 });
      await repositories.questionTheme.findAll(findAllOptions);

      expect(mocks.models.questionTheme.findQuery.limit).not.toHaveBeenCalled();
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
      mocks.models.questionTheme.find.mockReturnValue(createQuestionThemeMongooseFindQuery(foundQuestionThemeDocuments));
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

      expect(actualQuestionThemes).toStrictEqual(expectedQuestionThemes);
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

      expect(actualQuestionTheme).toStrictEqual(createdQuestionTheme);
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
        { returnDocument: "after" },
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

      expect(actualQuestionTheme).toStrictEqual(modifiedQuestionTheme);
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

      expect(mocks.models.questionTheme.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionThemeId, { status: "archived" }, { returnDocument: "after" });
    });

    it("should return update and map question theme when called.", async() => {
      const questionThemeId = "question-theme-id";
      const updatedQuestionThemeDocument = createFakeQuestionThemeDocument();
      const updatedQuestionTheme = createFakeQuestionTheme();
      mocks.models.questionTheme.findByIdAndUpdate.mockResolvedValue(updatedQuestionThemeDocument);
      mocks.mappers.questionTheme.createQuestionThemeFromDocument.mockReturnValue(updatedQuestionTheme);
      const actualQuestionTheme = await repositories.questionTheme.archive(questionThemeId);

      expect(actualQuestionTheme).toStrictEqual(updatedQuestionTheme);
    });

    it("should return undefined when document to archive is not found.", async() => {
      const questionThemeId = "question-theme-id";
      mocks.models.questionTheme.findByIdAndUpdate.mockResolvedValue(null);
      const actualQuestionTheme = await repositories.questionTheme.archive(questionThemeId);

      expect(actualQuestionTheme).toBeUndefined();
    });
  });

  describe(QuestionThemeMongooseRepository.prototype.getStats, () => {
    const statsAggResult: QuestionThemeStatsAggregationResult = {
      total: [{ count: 3 }],
      statusRows: [{ active: 2, archived: 1 }],
      byQuestionCount: [{ themeId: "665f1a2b3c4d5e6f7a8b9c0d", themeSlug: "cinema", activeQuestionCount: 0 }],
    };

    it("should return total from aggregation when themes exist.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([statsAggResult]);

      const result = await repositories.questionTheme.getStats();

      expect(result.total).toBe(3);
    });

    it("should return total as 0 when no themes exist.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([
{
  total: [],
  statusRows: [],
  byQuestionCount: [],
} satisfies QuestionThemeStatsAggregationResult,
      ]);

      const result = await repositories.questionTheme.getStats();

      expect(result.total).toBe(0);
    });

    it("should include all status keys in byStatus when aggregation returns status rows.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([statsAggResult]);

      const result = await repositories.questionTheme.getStats();

      expect(Object.keys(result.byStatus)).toStrictEqual(["active", "archived"]);
    });

    it("should skip status rows with null id when building byStatus map.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([
{
  total: [{ count: 1 }],
  statusRows: [{}],
  byQuestionCount: [],
} satisfies QuestionThemeStatsAggregationResult,
      ]);

      const result = await repositories.questionTheme.getStats();

      expect(Object.keys(result.byStatus)).toStrictEqual([]);
    });

    it("should return theme with zero active question count when no active questions reference a theme.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([
{
  total: [{ count: 1 }],
  statusRows: [{ active: 1 }],
  byQuestionCount: [{ themeId: "665f1a2b3c4d5e6f7a8b9c0d", themeSlug: "cinema", activeQuestionCount: 0 }],
} satisfies QuestionThemeStatsAggregationResult,
      ]);

      const result = await repositories.questionTheme.getStats();

      expect(result.byQuestionCount).toStrictEqual([{ themeId: "665f1a2b3c4d5e6f7a8b9c0d", themeSlug: "cinema", activeQuestionCount: 0 }]);
    });

    it("should populate active question count from lookup when questions are found.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([
{
  total: [{ count: 1 }],
  statusRows: [{ active: 1 }],
  byQuestionCount: [{ themeId: "665f1a2b3c4d5e6f7a8b9c0d", themeSlug: "cinema", activeQuestionCount: 5 }],
} satisfies QuestionThemeStatsAggregationResult,
      ]);

      const result = await repositories.questionTheme.getStats();

      expect(result.byQuestionCount[0].activeQuestionCount).toBe(5);
    });

    it("should return byQuestionCount sorted by slug when aggregation returns multiple themes.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([
{
  total: [{ count: 2 }],
  statusRows: [{ active: 2 }],
  byQuestionCount: [
    { themeId: "665f1a2b3c4d5e6f7a8b9c0d", themeSlug: "cinema", activeQuestionCount: 3 },
    { themeId: "775f1a2b3c4d5e6f7a8b9c0e", themeSlug: "sport", activeQuestionCount: 1 },
  ],
} satisfies QuestionThemeStatsAggregationResult,
      ]);

      const result = await repositories.questionTheme.getStats();

      expect(result.byQuestionCount[0].themeSlug).toBe("cinema");
    });

    it("should return second theme by slug order when aggregation returns multiple themes.", async() => {
      mocks.models.questionTheme.aggregate.mockResolvedValueOnce([
{
  total: [{ count: 2 }],
  statusRows: [{ active: 2 }],
  byQuestionCount: [
    { themeId: "665f1a2b3c4d5e6f7a8b9c0d", themeSlug: "cinema", activeQuestionCount: 3 },
    { themeId: "775f1a2b3c4d5e6f7a8b9c0e", themeSlug: "sport", activeQuestionCount: 1 },
  ],
} satisfies QuestionThemeStatsAggregationResult,
      ]);

      const result = await repositories.questionTheme.getStats();

      expect(result.byQuestionCount[1].themeSlug).toBe("sport");
    });
  });
});