import { vi } from "vitest";

import { createFakeQuestionAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";

import type { Mock } from "vitest";

import type { QuestionAggregate, QuestionAggregatePipeline } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

type QuestionMongooseModelStub = {
  aggregate: (pipeline?: QuestionAggregatePipeline) => Promise<QuestionAggregate[]>;
};

type MockedQuestionMongooseModel = { [K in keyof QuestionMongooseModelStub]: Mock<QuestionMongooseModelStub[K]> };

function createMockedQuestionMongooseModel(): MockedQuestionMongooseModel {
  return {
    aggregate: vi.fn<QuestionMongooseModelStub["aggregate"]>().mockResolvedValue([
      createFakeQuestionAggregate(),
      createFakeQuestionAggregate(),
      createFakeQuestionAggregate(),
    ]),
  };
}

export { createMockedQuestionMongooseModel };