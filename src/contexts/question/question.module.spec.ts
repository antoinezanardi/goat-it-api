import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
import { QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema";

import { ArchiveQuestionUseCase } from "@question/application/use-cases/archive-question/archive-question.use-case";
import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";
import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { FindRandomQuestionsUseCase } from "@question/application/use-cases/find-random-questions/find-random-questions.use-case";
import { GetQuestionStatsUseCase } from "@question/application/use-cases/get-question-stats/get-question-stats.use-case";
import { ModifyQuestionUseCase } from "@question/application/use-cases/modify-question/modify-question.use-case";
import { AssignThemeToQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/assign-theme-to-question/assign-theme-to-question.use-case";
import { ModifyQuestionThemeAssignmentUseCase } from "@question/application/use-cases/question-theme-assignment/modify-question-theme-assignment/modify-question-theme-assignment.use-case";
import { RemoveThemeFromQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/remove-theme-from-question/remove-theme-from-question.use-case";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import { QuestionController } from "@question/infrastructure/http/controllers/question/question.controller";
import { QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QuestionModule } from "@question/question.module";
import { QuestionUsageModule } from "@question/question-usage.module";

import { AppConfigTestingModule } from "@unit-tests/utils/helpers/nest/app-config-testing.module";

import { createMockedQuestionMongooseModel } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.model.mock";
import { createMockedQuestionThemeMongooseModel } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.model.mock";

import type { Type } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

describe(QuestionModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [AppConfigTestingModule, QuestionModule] })
      .overrideProvider(getModelToken(QuestionMongooseSchema.name))
      .useValue(createMockedQuestionMongooseModel())
      .overrideProvider(getModelToken(QuestionThemeMongooseSchema.name))
      .useValue(createMockedQuestionThemeMongooseModel())
      .compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it.each<{ useCase: Type<unknown> }>([
    { useCase: FindRandomQuestionsUseCase },
    { useCase: FindQuestionsUseCase },
    { useCase: FindQuestionByIdUseCase },
    { useCase: ArchiveQuestionUseCase },
    { useCase: ModifyQuestionUseCase },
    { useCase: CreateQuestionUseCase },
    { useCase: AssignThemeToQuestionUseCase },
    { useCase: RemoveThemeFromQuestionUseCase },
    { useCase: ModifyQuestionThemeAssignmentUseCase },
    { useCase: GetQuestionStatsUseCase },
  ])("should resolve $useCase when the module graph is compiled.", ({ useCase }) => {
    expect(module.get(useCase)).toBeInstanceOf(useCase);
  });

  it.each<{ controller: Type<unknown> }>([
    { controller: QuestionController },
    { controller: AdminQuestionController },
  ])("should resolve $controller when the module graph is compiled.", ({ controller }) => {
    expect(module.get(controller)).toBeInstanceOf(controller);
  });

  it("should inject the published theme lookup use case into CreateQuestionUseCase when the module graph is compiled.", () => {
    const createQuestionUseCase = module.get<CreateQuestionUseCase>(CreateQuestionUseCase);

    expect(createQuestionUseCase["getQuestionThemesByIdsOrThrowUseCase"]).toBe(module.get(GetQuestionThemesByIdsOrThrowUseCase));
  });

  it("should inject the published theme lookup use case into AssignThemeToQuestionUseCase when the module graph is compiled.", () => {
    const assignThemeToQuestionUseCase = module.get<AssignThemeToQuestionUseCase>(AssignThemeToQuestionUseCase);

    expect(assignThemeToQuestionUseCase["findQuestionThemeByIdUseCase"]).toBe(module.get(FindQuestionThemeByIdUseCase));
  });

  it("should inject the question lookup use case into AssignThemeToQuestionUseCase when the module graph is compiled.", () => {
    const assignThemeToQuestionUseCase = module.get<AssignThemeToQuestionUseCase>(AssignThemeToQuestionUseCase);

    expect(assignThemeToQuestionUseCase["findQuestionByIdUseCase"]).toBe(module.get(FindQuestionByIdUseCase));
  });

  it("should inject the question lookup use case into ModifyQuestionThemeAssignmentUseCase when the module graph is compiled.", () => {
    const modifyQuestionThemeAssignmentUseCase = module.get<ModifyQuestionThemeAssignmentUseCase>(ModifyQuestionThemeAssignmentUseCase);

    expect(modifyQuestionThemeAssignmentUseCase["findQuestionByIdUseCase"]).toBe(module.get(FindQuestionByIdUseCase));
  });

  it("should inject the question lookup use case into RemoveThemeFromQuestionUseCase when the module graph is compiled.", () => {
    const removeThemeFromQuestionUseCase = module.get<RemoveThemeFromQuestionUseCase>(RemoveThemeFromQuestionUseCase);

    expect(removeThemeFromQuestionUseCase["findQuestionByIdUseCase"]).toBe(module.get(FindQuestionByIdUseCase));
  });
});

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