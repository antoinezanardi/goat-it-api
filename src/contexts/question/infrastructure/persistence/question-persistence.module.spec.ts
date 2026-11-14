import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QuestionMongooseRepository } from "@question/infrastructure/persistence/mongoose/repository/question.mongoose.repository";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QuestionPersistenceModule } from "@question/infrastructure/persistence/question-persistence.module";

import { createMockedQuestionMongooseModel } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.model.mock";

import type { TestingModule } from "@nestjs/testing";

describe(QuestionPersistenceModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [QuestionPersistenceModule] })
      .overrideProvider(getModelToken(QuestionMongooseSchema.name))
      .useValue(createMockedQuestionMongooseModel())
      .compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it("should provide the question repository when the persistence module is compiled.", () => {
    expect(module.get(QUESTION_REPOSITORY_TOKEN)).toBeInstanceOf(QuestionMongooseRepository);
  });
});