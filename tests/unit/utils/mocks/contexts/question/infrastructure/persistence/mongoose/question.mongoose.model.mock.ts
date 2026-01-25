import { vi } from "vitest";

import type { QuestionMongooseDocumentStub } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.types.mock";

import { createFakeQuestionDocument } from "@faketories/contexts/question/mongoose-document/question.mongoose-document.faketory";
import { createFakeQuestionAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";

import type { Mock } from "vitest";

import type { QuestionAggregate, QuestionAggregatePipeline } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

type QuestionMongooseModelStub = {
  aggregate: (pipeline?: QuestionAggregatePipeline) => Promise<QuestionAggregate[]>;
  create: (questionCreationContract: Partial<QuestionAggregate>) => Promise<QuestionMongooseDocumentStub>;
};

type MockedQuestionMongooseModel = { [K in keyof QuestionMongooseModelStub]: Mock<QuestionMongooseModelStub[K]> };

function createMockedQuestionMongooseModel(): MockedQuestionMongooseModel {
  return {
    aggregate: vi.fn<QuestionMongooseModelStub["aggregate"]>().mockResolvedValue([
      createFakeQuestionAggregate(),
      createFakeQuestionAggregate(),
      createFakeQuestionAggregate(),
    ]),
    create: vi.fn<QuestionMongooseModelStub["create"]>().mockResolvedValue(createFakeQuestionDocument()),
  };
}

export { createMockedQuestionMongooseModel };