import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";

import { createQuestionFromAggregate, createQuestionMongooseInsertPayloadFromContract, createQuestionThemeAssignmentMongooseInsertPayloadFromContract } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { QUESTION_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline";
import { QuestionMongooseRepository } from "@question/infrastructure/persistence/mongoose/repository/question.mongoose.repository";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QUESTION_STATUS_ARCHIVED } from "@question/domain/value-objects/question-status/question-status.constants";

import { createMockedQuestionMongooseModel } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.model.mock";

import { createFakeQuestionDocument } from "@faketories/contexts/question/mongoose/mongoose-document/question.mongoose-document.faketory";
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionCreationContract } from "@faketories/contexts/question/contracts/question.contracts.faketory";
import { createFakeQuestionMongooseInsertPayload, createFakeQuestionThemeAssignmentMongooseInsertPayload } from "@faketories/contexts/question/mongoose/mongoose-insert-payload/question.mongoose-insert-payload.faketory";
import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";

import type { UpdateQuery } from "mongoose";
import type { Mock } from "vitest";
import type { TestingModule } from "@nestjs/testing";

import type { QuestionMongooseDocument } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";
import type { Question } from "@question/domain/entities/question.types";

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
    it("should aggregate with pipeline when called.", async() => {
      await repositories.question.findAll();

      expect(mocks.models.question.aggregate).toHaveBeenCalledExactlyOnceWith(QUESTION_MONGOOSE_REPOSITORY_PIPELINE);
    });

    it("should map and return questions when called.", async() => {
      const questions = await repositories.question.findAll();

      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenCalledTimes(questions.length);
    });

    it("should call the mapper with every aggregate returned from model when called.", async() => {
      const questionAggregates = [
        createFakeQuestionAggregate(),
        createFakeQuestionAggregate(),
      ];
      mocks.models.question.aggregate.mockResolvedValueOnce(questionAggregates);
      await repositories.question.findAll();

      expect(mocks.mappers.question.createQuestionFromAggregate).toHaveBeenNthCalledWith(1, questionAggregates[0], 0, questionAggregates);
      // It's okay to disable this rule here because we want to explicitly test multiple calls to the mapper function.
      // Multiple tests would be redundant.
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

      const actualQuestions = await repositories.question.findAll();

      expect(actualQuestions).toStrictEqual<Question[]>(expectedQuestions);
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
      const contract = createFakeQuestionThemeAssignmentCreationContract();
      const expectedInsert = createFakeQuestionThemeAssignmentMongooseInsertPayload();
      mocks.mappers.question.createQuestionThemeAssignmentMongooseInsertPayloadFromContract.mockReturnValueOnce(expectedInsert);

      await repositories.question.assignTheme(questionId, contract);

      const expectedUpdate = { $push: { themes: expectedInsert } };

      expect(mocks.models.question.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith(questionId, expectedUpdate);
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

      expect(actual).toStrictEqual<Question>(expectedQuestion);
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

      expect(actual).toStrictEqual<Question>(expectedQuestion);
    });
  });
});