import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";

import { createQuestionFromAggregate } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { QUESTION_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline";
import { QuestionMongooseRepository } from "@question/infrastructure/persistence/mongoose/repository/question.mongoose.repository";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

import { createMockedQuestionMongooseModel } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.model.mock";

import { createFakeQuestionDocument } from "@faketories/contexts/question/mongoose-document/question.mongoose-document.faketory";
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionCreationContract } from "@faketories/contexts/question/contracts/question.contracts.faketory";

import type { Mock } from "vitest";
import type { TestingModule } from "@nestjs/testing";

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
    it("should call model.create with contract when called.", async() => {
      const questionCreationContract = createFakeQuestionCreationContract();
      await repositories.question.create(questionCreationContract);

      expect(mocks.models.question.create).toHaveBeenCalledExactlyOnceWith(questionCreationContract);
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
});