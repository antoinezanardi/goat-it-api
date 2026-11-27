import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { QuestionThemeMongooseRepository } from "@question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema";
import { QuestionThemePersistenceModule } from "@question-theme/infrastructure/persistence/question-theme-persistence.module";

import { createMockedQuestionThemeMongooseModel } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.model.mock";

import type { TestingModule } from "@nestjs/testing";

describe(QuestionThemePersistenceModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [QuestionThemePersistenceModule] })
      .overrideProvider(getModelToken(QuestionThemeMongooseSchema.name))
      .useValue(createMockedQuestionThemeMongooseModel())
      .compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it("should provide the question theme repository when the persistence module is compiled.", () => {
    expect(module.get(QUESTION_THEME_REPOSITORY_TOKEN)).toBeInstanceOf(QuestionThemeMongooseRepository);
  });
});