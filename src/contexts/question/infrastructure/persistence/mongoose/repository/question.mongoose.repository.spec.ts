import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";

import { buildMongooseAggregationSortStages } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

import { createQuestionFromAggregate, createQuestionMongooseInsertPayloadFromContract, createQuestionThemeAssignmentMongooseInsertPayloadFromContract } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { QUESTION_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline";
import { QuestionMongooseRepository } from "@question/infrastructure/persistence/mongoose/repository/question.mongoose.repository";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QUESTION_AUTHOR_ROLES, QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_REJECTION_TYPES, QUESTION_STATUSES, QUESTION_STATUS_ACTIVE, QUESTION_STATUS_ARCHIVED, QUESTION_STATUS_PENDING, QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import { QUESTION_SEMANTIC_SORT_ORDERS } from "@question/infrastructure/persistence/mongoose/constants/question.mongoose.constants";
import type { QuestionCategory, QuestionCognitiveDifficulty } from "@question/domain/types/question.value-objects";

import { createMockedQuestionMongooseModel } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.model.mock";

import { createFakeQuestionDocument } from "@faketories/contexts/question/mongoose/mongoose-document/question.mongoose-document.faketory";
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionCreationContract } from "@faketories/contexts/question/contracts/question.contracts.faketory";
import { createFakeQuestionModificationContract } from "@faketories/contexts/question/contracts/question-modification/question-modification.contracts.faketory";
import { createFakeQuestionMongooseInsertPayload, createFakeQuestionThemeAssignmentMongooseInsertPayload } from "@faketories/contexts/question/mongoose/mongoose-insert-payload/question.mongoose-insert-payload.faketory";
import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";
import { createFakeFindAllOptions } from "@faketories/shared/domain/find-all-options.faketory";
import { createFakeFindRandomQuestionsOptions } from "@faketories/contexts/question/domain/find-random-questions-options.faketory";

import type { UpdateQuery } from "mongoose";
import type { Mock } from "vitest";
import type { TestingModule } from "@nestjs/testing";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionFilterOptions, QuestionSortableField } from "@question/domain/types/question.types";
import type { QuestionAggregate, QuestionMongooseDocument, QuestionStatsAggregationResult } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

vi.mock(import("@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers"));

describe("Question Mongoose Repository", () => {
  let repositories: { question: QuestionMongooseRepository };
  let mocks: {
    models: {
      question: ReturnType<typeof createMockedQuestionMongooseModel>;
    };
    mappers: {
      question: {
        createQuestionFromAggregate: Mock;
        createQuestionMongooseInsertPayloadFromContract: Mock;
        createQuestionThemeAssignmentMongooseInsertPayloadFromContract: Mock;
      };
    };
  };

  beforeEach(async() => {
    mocks = {
      models: {
        question: createMockedQuestionMongooseModel(),
      },
      mappers: {
        question: {
          createQuestionFromAggregate: vi.mocked(createQuestionFromAggregate),
          createQuestionMongooseInsertPayloadFromContract: vi.mocked(createQuestionMongooseInsertPayloadFromContract),
          createQuestionThemeAssignmentMongooseInsertPayloadFromContract: vi.mocked(createQuestionThemeAssignmentMongooseInsertPayloadFromContract),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(QuestionMongooseSchema.name),
          useValue: mocks.models.question,
        },
        QuestionMongooseRepository,
      ],
    }).compile();

    repositories = { question: module.get<QuestionMongooseRepository>(QuestionMongooseRepository) };
  });

  describe(QuestionMongooseRepository.prototype.findAll, () => {
    let findAllOptions: FindAllOptions<QuestionSortableField, QuestionFilterOptions>;

    beforeEach(() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortBy: "createdAt", sortOrder: "asc" }, limit: undefined });
    });

    it("should aggregate with pipeline and ascending sort stage when sort order is asc.", async() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortOrder: "asc", sortBy: "createdAt" }, limit: undefined });
      await repositories.question.findAll(findAllOptions);
      const expectedSortStages = buildMongooseAggregationSortStages(findAllOptions.sort, QUESTION_SEMANTIC_SORT_ORDERS);
      const expectedPipeline = [...QUESTION_MONGOOSE_REPOSITORY_PIPELINE, ...expectedSortStages];

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should aggregate with pipeline and descending sort stage when sort order is desc.", async() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortOrder: "desc", sortBy: "category" }, limit: undefined });
      await repositories.question.findAll(findAllOptions);
      const expectedSortStages = buildMongooseAggregationSortStages(findAllOptions.sort, QUESTION_SEMANTIC_SORT_ORDERS);
      const expectedPipeline = [...QUESTION_MONGOOSE_REPOSITORY_PIPELINE, ...expectedSortStages];

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should aggregate with pipeline and semantic sort stages when sort field has a semantic order.", async() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortOrder: "asc", sortBy: "status" }, limit: undefined });
      await repositories.question.findAll(findAllOptions);
      const expectedSortStages = buildMongooseAggregationSortStages(findAllOptions.sort, QUESTION_SEMANTIC_SORT_ORDERS);
      const expectedPipeline = [...QUESTION_MONGOOSE_REPOSITORY_PIPELINE, ...expectedSortStages];

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should aggregate with pipeline and semantic sort stages in descending order when sort field has a semantic order and direction is desc.", async() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortOrder: "desc", sortBy: "cognitiveDifficulty" }, limit: undefined });
      await repositories.question.findAll(findAllOptions);
      const expectedSortStages = buildMongooseAggregationSortStages(findAllOptions.sort, QUESTION_SEMANTIC_SORT_ORDERS);
      const expectedPipeline = [...QUESTION_MONGOOSE_REPOSITORY_PIPELINE, ...expectedSortStages];

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should map and return questions when called.", async() => {
      const questions = await repositories.question.findAll(findAllOptions);

      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenCalledTimes(questions.length);
    });

    it("should call the mapper with every aggregate returned from model when called.", async() => {
      const questionAggregates = [
        createFakeQuestionAggregate(),
        createFakeQuestionAggregate(),
      ];
      mocks.models.question.aggregate.mockResolvedValueOnce(questionAggregates);
      await repositories.question.findAll(findAllOptions);

      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenNthCalledWith(1, questionAggregates[0], 0, questionAggregates);
      // Acceptable as testing multiple calls to the mapper function requires multiple expects in a single block
      // oxlint-disable-next-line max-expects
      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenNthCalledWith(2, questionAggregates[1], 1, questionAggregates);
    });

    it("should return mapped questions from model when called.", async() => {
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];

      vi.mocked(createQuestionFromAggregate)
        .mockReturnValueOnce(expectedQuestions[0])
        .mockReturnValueOnce(expectedQuestions[1])
        .mockReturnValueOnce(expectedQuestions[2]);

      const actualQuestions = await repositories.question.findAll(findAllOptions);

      expect(actualQuestions).toStrictEqual(expectedQuestions);
    });

    it("should not include $limit stage when limit is not set.", async() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortOrder: "asc", sortBy: "createdAt" }, limit: undefined });
      await repositories.question.findAll(findAllOptions);
      const expectedSortStages = buildMongooseAggregationSortStages(findAllOptions.sort, QUESTION_SEMANTIC_SORT_ORDERS);
      const expectedPipeline = [...QUESTION_MONGOOSE_REPOSITORY_PIPELINE, ...expectedSortStages];

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should include $limit stage at end of pipeline when limit is set.", async() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortOrder: "asc", sortBy: "createdAt" }, limit: 5 });
      await repositories.question.findAll(findAllOptions);
      const expectedSortStages = buildMongooseAggregationSortStages(findAllOptions.sort, QUESTION_SEMANTIC_SORT_ORDERS);
      const expectedPipeline = [...QUESTION_MONGOOSE_REPOSITORY_PIPELINE, ...expectedSortStages, { $limit: 5 }];

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should not include $limit stage when limit is 0 (unlimited).", async() => {
      findAllOptions = createFakeFindAllOptions(QUESTION_SORTABLE_FIELDS, { sort: { sortOrder: "asc", sortBy: "createdAt" }, limit: 0 });
      await repositories.question.findAll(findAllOptions);
      const expectedSortStages = buildMongooseAggregationSortStages(findAllOptions.sort, QUESTION_SEMANTIC_SORT_ORDERS);
      const expectedPipeline = [...QUESTION_MONGOOSE_REPOSITORY_PIPELINE, ...expectedSortStages];

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });
  });

  describe(QuestionMongooseRepository.prototype.findById, () => {
    it("should aggregate with pipeline when called.", async() => {
      const questionId = "618c1f4b3a2f000000000001";
      const expectedMatchStage = { $match: { _id: new Types.ObjectId(questionId) } };
      const expectedPipeline = [expectedMatchStage, ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE];
      await repositories.question.findById(questionId);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should map and return question when aggregate returns one.", async() => {
      const questionId = "618c1f4b3a2f000000000002";
      const foundAggregate = createFakeQuestionAggregate();
      mocks.models.question.aggregate.mockResolvedValue([foundAggregate]);

      await repositories.question.findById(questionId);

      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenCalledExactlyOnceWith(foundAggregate);
    });

    it("should return undefined when aggregate returns empty array.", async() => {
      const questionId = "618c1f4b3a2f000000000003";
      mocks.models.question.aggregate.mockResolvedValue([]);

      const actualQuestion = await repositories.question.findById(questionId);

      expect(actualQuestion).toBeUndefined();
    });

    it("should not call the mapper when aggregate returns empty array.", async() => {
      const questionId = "618c1f4b3a2f000000000004";
      mocks.models.question.aggregate.mockResolvedValue([]);
      await repositories.question.findById(questionId);

      expect(mocks.mappers.question.createQuestionFromAggregate).not.toHaveBeenCalled();
    });
  });

  describe(QuestionMongooseRepository.prototype.create, () => {
    it("should call model.create with mapped when called.", async() => {
      const questionCreationContract = createFakeQuestionCreationContract();
      const expectedInsertPayload = createFakeQuestionMongooseInsertPayload();
      mocks.mappers.question.createQuestionMongooseInsertPayloadFromContract.mockReturnValueOnce(expectedInsertPayload);
      await repositories.question.create(questionCreationContract);

      expect(mocks.models.question.create).toHaveBeenCalledExactlyOnceWith(expectedInsertPayload);
    });

    it("should call findById with created id when called.", async() => {
      const questionCreationContract = createFakeQuestionCreationContract();
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.create.mockResolvedValueOnce(createdDocument);
      const expectedQuestion = createFakeQuestion();
      const findByIdSpy = vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(expectedQuestion);

      await repositories.question.create(questionCreationContract);

      expect(findByIdSpy).toHaveBeenCalledExactlyOnceWith(createdDocument._id.toString());
    });

    it("should return the question returned by findById when called.", async() => {
      const questionCreationContract = createFakeQuestionCreationContract();
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.create.mockResolvedValueOnce(createdDocument);
      const expectedQuestion = createFakeQuestion();
      vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(expectedQuestion);

      const actualQuestion = await repositories.question.create(questionCreationContract);

      expect(actualQuestion).toStrictEqual(expectedQuestion);
    });
  });

  describe(QuestionMongooseRepository.prototype.archive, () => {
    it("should call model.findByIdAndUpdate with archived status when called.", async() => {
      const questionId = "618c1f4b3a2f000000000010";
      const expectedUpdate: UpdateQuery<QuestionMongooseDocument> = { status: QUESTION_STATUS_ARCHIVED };

      await repositories.question.archive(questionId);

      expect(mocks.models.question.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionId, expectedUpdate);
    });

    it("should return undefined when model.findByIdAndUpdate returns null.", async() => {
      const questionId = "618c1f4b3a2f000000000011";
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(null);

      const actual = await repositories.question.archive(questionId);

      expect(actual).toBeUndefined();
    });

    it("should call findById with the question id when called.", async() => {
      const questionId = "618c1f4b3a2f000000000012";
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(createdDocument);
      const findByIdSpy = vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(createFakeQuestion());

      await repositories.question.archive(questionId);

      expect(findByIdSpy).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should return the question returned by findById when called.", async() => {
      const questionId = "618c1f4b3a2f000000000013";
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(createdDocument);
      const expectedQuestion = createFakeQuestion();
      vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(expectedQuestion);

      const actual = await repositories.question.archive(questionId);

      expect(actual).toStrictEqual(expectedQuestion);
    });
  });

  describe(QuestionMongooseRepository.prototype.assignTheme, () => {
    it("should call model.findByIdAndUpdate with push update when called.", async() => {
      const questionId = "618c1f4b3a2f000000000020";
      const contract = createFakeQuestionThemeAssignmentCreationContract({ isPrimary: false });
      const expectedInsert = createFakeQuestionThemeAssignmentMongooseInsertPayload();
      mocks.mappers.question.createQuestionThemeAssignmentMongooseInsertPayloadFromContract.mockReturnValueOnce(expectedInsert);

      await repositories.question.assignTheme(questionId, contract);

      const expectedUpdate = { $push: { themes: expectedInsert } };

      expect(mocks.models.question.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionId, expectedUpdate);
    });

    it("should call model.bulkWrite with demotion and push when contract has isPrimary true.", async() => {
      const questionId = "618c1f4b3a2f000000000050";
      const contract = createFakeQuestionThemeAssignmentCreationContract({ isPrimary: true });
      const expectedInsert = createFakeQuestionThemeAssignmentMongooseInsertPayload();
      mocks.mappers.question.createQuestionThemeAssignmentMongooseInsertPayloadFromContract.mockReturnValueOnce(expectedInsert);

      await repositories.question.assignTheme(questionId, contract);

      const expectedBulkOps = [
        {
          updateOne: {
            filter: { _id: new Types.ObjectId(questionId) },
            update: { $set: { "themes.$[].isPrimary": false } },
          },
        },
        {
          updateOne: {
            filter: { _id: new Types.ObjectId(questionId) },
            update: { $push: { themes: expectedInsert } },
          },
        },
      ];

      expect(mocks.models.question.bulkWrite).toHaveBeenCalledExactlyOnceWith(expectedBulkOps);
    });

    it("should return undefined when model.findByIdAndUpdate returns null.", async() => {
      const questionId = "618c1f4b3a2f000000000021";
      const contract = createFakeQuestionThemeAssignmentCreationContract();
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(null);

      const actual = await repositories.question.assignTheme(questionId, contract);

      expect(actual).toBeUndefined();
    });

    it("should call findById with the question id when called.", async() => {
      const questionId = "618c1f4b3a2f000000000022";
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(createdDocument);
      const findByIdSpy = vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(createFakeQuestion());

      await repositories.question.assignTheme(questionId, createFakeQuestionThemeAssignmentCreationContract());

      expect(findByIdSpy).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should return the question returned by findById when called.", async() => {
      const questionId = "618c1f4b3a2f000000000023";
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(createdDocument);
      const expectedQuestion = createFakeQuestion();
      vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(expectedQuestion);

      const actual = await repositories.question.assignTheme(questionId, createFakeQuestionThemeAssignmentCreationContract());

      expect(actual).toStrictEqual(expectedQuestion);
    });
  });

  describe(QuestionMongooseRepository.prototype.removeTheme, () => {
    it("should call model.findByIdAndUpdate with pull update when called.", async() => {
      const questionId = "618c1f4b3a2f000000000030";
      const themeId = "618c1f4b3a2f000000000031";

      await repositories.question.removeTheme(questionId, themeId);

      const expectedUpdate = { $pull: { themes: { themeId: new Types.ObjectId(themeId) } } };

      expect(mocks.models.question.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionId, expectedUpdate);
    });

    it("should return undefined when model.findByIdAndUpdate returns null.", async() => {
      const questionId = "618c1f4b3a2f000000000032";
      const themeId = "618c1f4b3a2f000000000033";
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(null);

      const actual = await repositories.question.removeTheme(questionId, themeId);

      expect(actual).toBeUndefined();
    });

    it("should call findById with the question id when called.", async() => {
      const questionId = "618c1f4b3a2f000000000034";
      const themeId = "618c1f4b3a2f000000000035";
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(createdDocument);
      const findByIdSpy = vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(createFakeQuestion());

      await repositories.question.removeTheme(questionId, themeId);

      expect(findByIdSpy).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should return the question returned by findById when called.", async() => {
      const questionId = "618c1f4b3a2f000000000036";
      const themeId = "618c1f4b3a2f000000000037";
      const createdDocument = createFakeQuestionDocument();
      mocks.models.question.findByIdAndUpdate.mockResolvedValueOnce(createdDocument);
      const expectedQuestion = createFakeQuestion();
      vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(expectedQuestion);

      const actual = await repositories.question.removeTheme(questionId, themeId);

      expect(actual).toStrictEqual(expectedQuestion);
    });
  });

  describe(QuestionMongooseRepository.prototype.modifyThemeAssignment, () => {
    it("should call model.findByIdAndUpdate with set update for isHint when contract has isHint.", async() => {
      const questionId = "618c1f4b3a2f000000000040";
      const themeId = "618c1f4b3a2f000000000041";
      const contract = { isHint: true };

      await repositories.question.modifyThemeAssignment(questionId, themeId, contract);

      const expectedUpdate = {
        $set: { "themes.$[elem].isHint": true },
      };
      const expectedOptions = {
        arrayFilters: [{ "elem.themeId": new Types.ObjectId(themeId) }],
      };

      expect(mocks.models.question.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionId, expectedUpdate, expectedOptions);
    });

    it("should not call model.findByIdAndUpdate when contract has no fields.", async() => {
      const questionId = "618c1f4b3a2f000000000060";
      const themeId = "618c1f4b3a2f000000000061";
      const contract = {};

      await repositories.question.modifyThemeAssignment(questionId, themeId, contract);

      expect(mocks.models.question.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should call model.bulkWrite with demotion and promotion when contract has isPrimary true.", async() => {
      const questionId = "618c1f4b3a2f000000000042";
      const themeId = "618c1f4b3a2f000000000043";
      const contract = { isPrimary: true as const };

      await repositories.question.modifyThemeAssignment(questionId, themeId, contract);

      const expectedBulkOps = [
        {
          updateOne: {
            filter: { _id: new Types.ObjectId(questionId) },
            update: { $set: { "themes.$[].isPrimary": false } },
          },
        },
        {
          updateOne: {
            filter: { _id: new Types.ObjectId(questionId) },
            update: { $set: { "themes.$[elem].isPrimary": true } },
            arrayFilters: [{ "elem.themeId": new Types.ObjectId(themeId) }],
          },
        },
      ];

      expect(mocks.models.question.bulkWrite).toHaveBeenCalledExactlyOnceWith(expectedBulkOps);
    });

    it("should not include isHint in bulkWrite set fields when contract has isPrimary true but isHint is undefined.", async() => {
      const questionId = "618c1f4b3a2f000000000051";
      const themeId = "618c1f4b3a2f000000000052";
      const contract = { isPrimary: true as const };

      await repositories.question.modifyThemeAssignment(questionId, themeId, contract);

      const actualBulkOps = mocks.models.question.bulkWrite.mock.calls[0][0] as Record<string, unknown>[];
      const promotionOp = actualBulkOps[1] as { updateOne: { update: { $set: Record<string, unknown> } } };

      expect(promotionOp.updateOne.update.$set).not.toHaveProperty("themes.$[elem].isHint");
    });

    it("should call model.bulkWrite with demotion, promotion and isHint when contract has both fields.", async() => {
      const questionId = "618c1f4b3a2f000000000044";
      const themeId = "618c1f4b3a2f000000000045";
      const contract = { isPrimary: true as const, isHint: false };

      await repositories.question.modifyThemeAssignment(questionId, themeId, contract);

      const expectedBulkOps = [
        {
          updateOne: {
            filter: { _id: new Types.ObjectId(questionId) },
            update: { $set: { "themes.$[].isPrimary": false } },
          },
        },
        {
          updateOne: {
            filter: { _id: new Types.ObjectId(questionId) },
            update: { $set: { "themes.$[elem].isPrimary": true, "themes.$[elem].isHint": false } },
            arrayFilters: [{ "elem.themeId": new Types.ObjectId(themeId) }],
          },
        },
      ];

      expect(mocks.models.question.bulkWrite).toHaveBeenCalledExactlyOnceWith(expectedBulkOps);
    });

    it("should call findById with the question id when called.", async() => {
      const questionId = "618c1f4b3a2f000000000046";
      const themeId = "618c1f4b3a2f000000000047";
      const findByIdSpy = vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(createFakeQuestion());

      await repositories.question.modifyThemeAssignment(questionId, themeId, { isHint: true });

      expect(findByIdSpy).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should return the question returned by findById when called.", async() => {
      const questionId = "618c1f4b3a2f000000000048";
      const themeId = "618c1f4b3a2f000000000049";
      const expectedQuestion = createFakeQuestion();
      vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(expectedQuestion);

      const actual = await repositories.question.modifyThemeAssignment(questionId, themeId, { isHint: true });

      expect(actual).toStrictEqual(expectedQuestion);
    });
  });

  describe(QuestionMongooseRepository.prototype.modify, () => {
    it("should call model.findByIdAndUpdate with crushed data when called.", async() => {
      const questionId = "618c1f4b3a2f000000000070";
      const contract = { category: "lexicon" as const, content: { statement: { fr: "Nouvelle question" } } };

      await repositories.question.modify(questionId, contract);

      const expectedUpdate = {
        $set: {
          "category": "lexicon",
          "content.statement.fr": "Nouvelle question",
        },
      };

      expect(mocks.models.question.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionId, expectedUpdate);
    });

    it("should call findById with the question id when called.", async() => {
      const questionId = "618c1f4b3a2f000000000071";
      const contract = createFakeQuestionModificationContract();
      const findByIdSpy = vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(createFakeQuestion());

      await repositories.question.modify(questionId, contract);

      expect(findByIdSpy).toHaveBeenCalledExactlyOnceWith(questionId);
    });

    it("should return the question returned by findById when called.", async() => {
      const questionId = "618c1f4b3a2f000000000072";
      const contract = createFakeQuestionModificationContract();
      const expectedQuestion = createFakeQuestion();
      vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(expectedQuestion);

      const actual = await repositories.question.modify(questionId, contract);

      expect(actual).toStrictEqual(expectedQuestion);
    });

    it("should return undefined when findById returns undefined.", async() => {
      const questionId = "618c1f4b3a2f000000000073";
      const contract = createFakeQuestionModificationContract();
      vi.spyOn(repositories.question, "findById").mockResolvedValueOnce(undefined);

      const actual = await repositories.question.modify(questionId, contract);

      expect(actual).toBeUndefined();
    });
  });

  describe(QuestionMongooseRepository.prototype.findRandom, () => {
    it.each([5, 10])("should aggregate with match, sample and pipeline stages when limit is %s.", async limit => {
      const options = createFakeFindRandomQuestionsOptions({ limit, excludedIds: undefined, categories: undefined, cognitiveDifficulties: undefined, themeIds: undefined });
      const expectedPipeline = [
        { $match: { status: QUESTION_STATUS_ACTIVE } },
        { $sample: { size: limit } },
        ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ];

      await repositories.question.findRandom(options);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should add excluded ids to match stage as ObjectId $nin when provided.", async() => {
      const excludedIds = ["618c1f4b3a2f000000000001", "618c1f4b3a2f000000000002"];
      const options = createFakeFindRandomQuestionsOptions({ limit: 5, excludedIds, categories: undefined, cognitiveDifficulties: undefined, themeIds: undefined });
      const expectedPipeline = [
        {
          $match: {
            status: QUESTION_STATUS_ACTIVE,
            _id: { $nin: excludedIds.map(id => new Types.ObjectId(id)) },
          },
        },
        { $sample: { size: 5 } },
        ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ];

      await repositories.question.findRandom(options);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should add categories to match stage as $in when provided.", async() => {
      const categories: QuestionCategory[] = ["trivia", "riddle"];
      const options = createFakeFindRandomQuestionsOptions({ limit: 5, categories, excludedIds: undefined, cognitiveDifficulties: undefined, themeIds: undefined });
      const expectedPipeline = [
        {
          $match: {
            status: QUESTION_STATUS_ACTIVE,
            category: { $in: categories },
          },
        },
        { $sample: { size: 5 } },
        ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ];

      await repositories.question.findRandom(options);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should add cognitive difficulties to match stage as $in when provided.", async() => {
      const cognitiveDifficulties: QuestionCognitiveDifficulty[] = ["easy", "hard"];
      const options = createFakeFindRandomQuestionsOptions({ limit: 5, cognitiveDifficulties, excludedIds: undefined, categories: undefined, themeIds: undefined });
      const expectedPipeline = [
        {
          $match: {
            status: QUESTION_STATUS_ACTIVE,
            cognitiveDifficulty: { $in: cognitiveDifficulties },
          },
        },
        { $sample: { size: 5 } },
        ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ];

      await repositories.question.findRandom(options);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should add theme ids to match stage as ObjectId $in on nested themeId when provided.", async() => {
      const themeIds = ["618c1f4b3a2f000000000001", "618c1f4b3a2f000000000002"];
      const options = createFakeFindRandomQuestionsOptions({ limit: 5, themeIds, excludedIds: undefined, categories: undefined, cognitiveDifficulties: undefined });
      const expectedPipeline = [
        {
          $match: {
            "status": QUESTION_STATUS_ACTIVE,
            "themes.themeId": { $in: themeIds.map(id => new Types.ObjectId(id)) },
          },
        },
        { $sample: { size: 5 } },
        ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ];

      await repositories.question.findRandom(options);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should compose all filters in a single match stage when all options are provided.", async() => {
      const excludedIds = ["618c1f4b3a2f000000000001"];
      const categories: QuestionCategory[] = ["trivia"];
      const cognitiveDifficulties: QuestionCognitiveDifficulty[] = ["easy"];
      const themeIds = ["618c1f4b3a2f000000000002"];
      const options = createFakeFindRandomQuestionsOptions({ limit: 5, excludedIds, categories, cognitiveDifficulties, themeIds });
      const expectedPipeline = [
        {
          $match: {
            "status": QUESTION_STATUS_ACTIVE,
            "_id": { $nin: excludedIds.map(id => new Types.ObjectId(id)) },
            "category": { $in: categories },
            "cognitiveDifficulty": { $in: cognitiveDifficulties },
            "themes.themeId": { $in: themeIds.map(id => new Types.ObjectId(id)) },
          },
        },
        { $sample: { size: 5 } },
        ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ];

      await repositories.question.findRandom(options);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should not add filter to match stage when provided array is empty.", async() => {
      const options = createFakeFindRandomQuestionsOptions({ limit: 5, excludedIds: [], categories: [], cognitiveDifficulties: [], themeIds: [] });
      const expectedPipeline = [
        { $match: { status: QUESTION_STATUS_ACTIVE } },
        { $sample: { size: 5 } },
        ...QUESTION_MONGOOSE_REPOSITORY_PIPELINE,
      ];

      await repositories.question.findRandom(options);

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(expectedPipeline);
    });

    it("should map and return questions when called.", async() => {
      const options = createFakeFindRandomQuestionsOptions({ limit: 3, excludedIds: undefined, categories: undefined, cognitiveDifficulties: undefined, themeIds: undefined });
      const questionAggregates = [
        createFakeQuestionAggregate(),
        createFakeQuestionAggregate(),
      ];
      mocks.models.question.aggregate.mockResolvedValueOnce(questionAggregates);

      await repositories.question.findRandom(options);

      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenCalledTimes(questionAggregates.length);
    });

    it("should call the mapper with every aggregate returned from model when called.", async() => {
      const options = createFakeFindRandomQuestionsOptions({ limit: 2, excludedIds: undefined, categories: undefined, cognitiveDifficulties: undefined, themeIds: undefined });
      const questionAggregates = [
        createFakeQuestionAggregate(),
        createFakeQuestionAggregate(),
      ];
      mocks.models.question.aggregate.mockResolvedValueOnce(questionAggregates);

      await repositories.question.findRandom(options);

      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenNthCalledWith(1, questionAggregates[0], 0, questionAggregates);
      // Acceptable as testing multiple calls to the mapper function requires multiple expects in a single block
      // oxlint-disable-next-line max-expects
      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenNthCalledWith(2, questionAggregates[1], 1, questionAggregates);
    });

    it("should return mapped questions from model when called.", async() => {
      const options = createFakeFindRandomQuestionsOptions({ limit: 2, excludedIds: undefined, categories: undefined, cognitiveDifficulties: undefined, themeIds: undefined });
      const questionAggregates = [
        createFakeQuestionAggregate(),
        createFakeQuestionAggregate(),
      ];
      mocks.models.question.aggregate.mockResolvedValueOnce(questionAggregates);
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];

      vi.mocked(createQuestionFromAggregate)
        .mockReturnValueOnce(expectedQuestions[0])
        .mockReturnValueOnce(expectedQuestions[1]);

      const actualQuestions = await repositories.question.findRandom(options);

      expect(actualQuestions).toStrictEqual(expectedQuestions);
    });
  });

  describe(QuestionMongooseRepository.prototype.countLiveByThemeId, () => {
    it("should return count of live questions when referencing a theme.", async() => {
      const themeId = "618c1f4b3a2f000000000038";
      const expectedCount = 2;
      mocks.models.question.countDocuments.mockResolvedValueOnce(expectedCount);

      const actual = await repositories.question.countLiveByThemeId(themeId);

      expect(actual).toBe(expectedCount);
    });

    it("should return 0 when no live questions reference the theme.", async() => {
      const themeId = "618c1f4b3a2f000000000039";
      mocks.models.question.countDocuments.mockResolvedValueOnce(0);

      const actual = await repositories.question.countLiveByThemeId(themeId);

      expect(actual).toBe(0);
    });

    it("should call countDocuments with correct query parameters when called.", async() => {
      const themeId = "618c1f4b3a2f00000000003a";
      mocks.models.question.countDocuments.mockResolvedValueOnce(0);

      await repositories.question.countLiveByThemeId(themeId);

      expect(mocks.models.question.countDocuments).toHaveBeenCalledExactlyOnceWith({
        themes: {
          $elemMatch: {
            themeId: new Types.ObjectId(themeId),
          },
        },
        status: {
          $in: [QUESTION_STATUS_PENDING, QUESTION_STATUS_ACTIVE],
        },
      });
    });
  });

  describe(QuestionMongooseRepository["mapAggregationRowsToRecord"], () => {
    const keys = ["keyA", "keyB", "keyC"] as const;

    it("should return all keys with zero when rows are empty.", () => {
      const result = QuestionMongooseRepository["mapAggregationRowsToRecord"]([], keys);

      expect(result).toStrictEqual({ keyA: 0, keyB: 0, keyC: 0 });
    });

    it("should populate counts from rows when some keys have values.", () => {
      const result = QuestionMongooseRepository["mapAggregationRowsToRecord"](
        [{ _id: "keyA", count: 3 }, { _id: "keyC", count: 1 }],
        keys,
      );

      expect(result).toStrictEqual({ keyA: 3, keyB: 0, keyC: 1 });
    });

    it("should skip rows with null _id when computing the record.", () => {
      const result = QuestionMongooseRepository["mapAggregationRowsToRecord"](
        [{ _id: null, count: 5 }],
        keys,
      );

      expect(result).toStrictEqual({ keyA: 0, keyB: 0, keyC: 0 });
    });
  });

  describe(QuestionMongooseRepository.prototype.getStats, () => {
    const facetResult: QuestionStatsAggregationResult = {
      totalStage: [{ count: 5 }],
      byStatusStage: [{ _id: "active", count: 3 }, { _id: "pending", count: 2 }],
      byCategoryStage: [{ _id: "trivia", count: 5 }],
      byCognitiveDifficultyStage: [{ _id: "medium", count: 5 }],
      byAuthorRoleStage: [{ _id: "admin", count: 5 }],
      byRejectionTypeStage: [{ _id: "duplicate-question", count: 1 }],
    };

    it("should call aggregate with a $facet pipeline when invoked.", async() => {
      mocks.models.question.aggregate.mockResolvedValueOnce([facetResult as unknown as QuestionAggregate]);
      await repositories.question.getStats();

      // Acceptable as expect.any is needed for partial matching and returns any
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith([{ $facet: expect.any(Object) }]);
    });

    it("should return total from the $facet result when called.", async() => {
      mocks.models.question.aggregate.mockResolvedValueOnce([facetResult as unknown as QuestionAggregate]);
      const result = await repositories.question.getStats();

      expect(result.total).toBe(5);
    });

    it("should return total as 0 when totalStage is empty.", async() => {
      mocks.models.question.aggregate.mockResolvedValueOnce([{ ...facetResult, totalStage: [] } as unknown as QuestionAggregate]);
      const result = await repositories.question.getStats();

      expect(result.total).toBe(0);
    });

    it.each<
      { fieldName: "byStatus" | "byCategory" | "byCognitiveDifficulty" | "byAuthorRole" | "byRejectionType"; keysArray: readonly string[] }
    >([
      { fieldName: "byStatus", keysArray: QUESTION_STATUSES },
      { fieldName: "byCategory", keysArray: QUESTION_CATEGORIES },
      { fieldName: "byCognitiveDifficulty", keysArray: QUESTION_COGNITIVE_DIFFICULTIES },
      { fieldName: "byAuthorRole", keysArray: QUESTION_AUTHOR_ROLES },
      { fieldName: "byRejectionType", keysArray: QUESTION_REJECTION_TYPES },
    ])("should include all $fieldName keys when stats are returned.", async({ fieldName, keysArray }) => {
      mocks.models.question.aggregate.mockResolvedValueOnce([facetResult as unknown as QuestionAggregate]);
      const result = await repositories.question.getStats();

      expect(Object.keys(result[fieldName])).toStrictEqual([...keysArray]);
    });

    it("should populate non-zero status counts from the aggregation when called.", async() => {
      mocks.models.question.aggregate.mockResolvedValueOnce([facetResult as unknown as QuestionAggregate]);
      const result = await repositories.question.getStats();

      expect(result.byStatus.active).toBe(3);
    });
  });
});