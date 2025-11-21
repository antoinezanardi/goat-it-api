import { createFakeQuestionThemeDocument } from "@factories/contexts/question/question-theme/question-theme.factory";

import type { Mock } from "vitest";

import type { QuestionThemeMongooseDocument } from "@question/infrastructure/persistence/mongoose/question-theme/types/question-theme.mongoose.types";

type QuestionThemeMongooseModelStub = {
  find: () => Promise<QuestionThemeMongooseDocument[]>;
  findById: (id: string) => Promise<QuestionThemeMongooseDocument | null>;
  create: () => Promise<QuestionThemeMongooseDocument>;
  findByIdAndUpdate: (id: string, update: unknown, options?: unknown) => Promise<QuestionThemeMongooseDocument | null>;
};

type MockedQuestionThemeMongooseModel = { [K in keyof QuestionThemeMongooseModelStub]: Mock<QuestionThemeMongooseModelStub[K]> };

function createMockedQuestionThemeMongooseModel(): MockedQuestionThemeMongooseModel {
  return {
    find: vi.fn<QuestionThemeMongooseModelStub["find"]>().mockResolvedValue([
      createFakeQuestionThemeDocument(),
      createFakeQuestionThemeDocument(),
      createFakeQuestionThemeDocument(),
    ]),
    findById: vi.fn<QuestionThemeMongooseModelStub["findById"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    create: vi.fn<QuestionThemeMongooseModelStub["create"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    findByIdAndUpdate: vi.fn<QuestionThemeMongooseModelStub["findByIdAndUpdate"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
  };
}

export { createMockedQuestionThemeMongooseModel };