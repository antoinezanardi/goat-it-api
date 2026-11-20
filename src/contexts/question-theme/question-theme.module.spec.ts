import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { ArchiveQuestionThemeUseCase } from "@question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { CreateQuestionThemeUseCase } from "@question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { GetQuestionThemeStatsUseCase } from "@question-theme/application/use-cases/get-question-theme-stats/get-question-theme-stats.use-case";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
import { ModifyQuestionThemeUseCase } from "@question-theme/application/use-cases/modify-question-theme/modify-question-theme.use-case";
import { AdminQuestionThemeController } from "@question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller";
import { QuestionThemeController } from "@question-theme/infrastructure/http/controllers/question-theme/question-theme.controller";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema";
import { QuestionThemeModule } from "@question-theme/question-theme.module";

import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

import { AppConfigTestingModule } from "@unit-tests/utils/helpers/nest/app-config-testing.module";

import { createMockedQuestionMongooseModel } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.model.mock";
import { createMockedQuestionThemeMongooseModel } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.model.mock";

import type { Type } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

describe(QuestionThemeModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [AppConfigTestingModule, QuestionThemeModule] })
      .overrideProvider(getModelToken(QuestionThemeMongooseSchema.name))
      .useValue(createMockedQuestionThemeMongooseModel())
      .overrideProvider(getModelToken(QuestionMongooseSchema.name))
      .useValue(createMockedQuestionMongooseModel())
      .compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it.each<{ useCase: Type<unknown> }>([
    { useCase: FindQuestionThemesUseCase },
    { useCase: GetQuestionThemesByIdsOrThrowUseCase },
    { useCase: FindQuestionThemeByIdUseCase },
    { useCase: CreateQuestionThemeUseCase },
    { useCase: ModifyQuestionThemeUseCase },
    { useCase: GetQuestionThemeStatsUseCase },
    { useCase: ArchiveQuestionThemeUseCase },
  ])("should resolve $useCase when the module graph is compiled.", ({ useCase }) => {
    expect(module.get(useCase)).toBeInstanceOf(useCase);
  });

  it.each<{ controller: Type<unknown> }>([
    { controller: QuestionThemeController },
    { controller: AdminQuestionThemeController },
  ])("should resolve $controller when the module graph is compiled.", ({ controller }) => {
    expect(module.get(controller)).toBeInstanceOf(controller);
  });

  it("should inject the published question count use case into ArchiveQuestionThemeUseCase when the module graph is compiled.", () => {
    const archiveQuestionThemeUseCase = module.get<ArchiveQuestionThemeUseCase>(ArchiveQuestionThemeUseCase);

    expect(archiveQuestionThemeUseCase["countLiveQuestionsByThemeIdUseCase"]).toBe(module.get(CountLiveQuestionsByThemeIdUseCase));
  });
});