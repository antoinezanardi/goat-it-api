import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QuestionUsageModule } from "@question/question-usage.module";

import { createMockedQuestionMongooseModel } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.model.mock";

import type { TestingModule } from "@nestjs/testing";

describe(QuestionUsageModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [QuestionUsageModule] })
      .overrideProvider(getModelToken(QuestionMongooseSchema.name))
      .useValue(createMockedQuestionMongooseModel())
      .compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it("should resolve CountLiveQuestionsByThemeIdUseCase when the usage module is compiled.", () => {
    expect(module.get(CountLiveQuestionsByThemeIdUseCase)).toBeInstanceOf(CountLiveQuestionsByThemeIdUseCase);
  });
});