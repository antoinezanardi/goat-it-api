import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";

import type { Mock } from "vitest";

type QuestionThemeMongooseModelStub = {
  find: () => Promise<QuestionThemeMongooseDocumentStub[]>;
  findOne: () => Promise<QuestionThemeMongooseDocumentStub | null>;
  findById: (id: string) => Promise<QuestionThemeMongooseDocumentStub | null>;
  create: () => Promise<QuestionThemeMongooseDocumentStub>;
  findByIdAndUpdate: (id: string, update: unknown, options?: unknown) => Promise<QuestionThemeMongooseDocumentStub | null>;
};

type MockedQuestionThemeMongooseModel = { [K in keyof QuestionThemeMongooseModelStub]: Mock<QuestionThemeMongooseModelStub[K]> };

function createMockedQuestionThemeMongooseModel(overrides: Partial<MockedQuestionThemeMongooseModel> = {}): MockedQuestionThemeMongooseModel {
  return {
    find: vi.fn<QuestionThemeMongooseModelStub["find"]>().mockResolvedValue([
      createFakeQuestionThemeDocument(),
      createFakeQuestionThemeDocument(),
      createFakeQuestionThemeDocument(),
    ]),
    findOne: vi.fn<QuestionThemeMongooseModelStub["findOne"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    findById: vi.fn<QuestionThemeMongooseModelStub["findById"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    create: vi.fn<QuestionThemeMongooseModelStub["create"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    findByIdAndUpdate: vi.fn<QuestionThemeMongooseModelStub["findByIdAndUpdate"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    ...overrides,
  };
}

export { createMockedQuestionThemeMongooseModel };