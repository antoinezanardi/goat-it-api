import { createFakeQuestionThemeDocument } from "@factories/contexts/question/question-theme/question-theme.factory";

import type { Mock } from "vitest";

import type { QuestionThemeMongooseDocument } from "@question/infrastructure/persistence/mongoose/question-theme/types/question-theme.mongoose.types";

type MockedQuestionThemeMongooseModel = {
  find: Mock<() => Promise<QuestionThemeMongooseDocument[]>>;
  findById: Mock<(id: string) => Promise<QuestionThemeMongooseDocument | null>>;
  create: Mock<() => Promise<QuestionThemeMongooseDocument>>;
  findByIdAndUpdate: Mock<(id: string) => Promise<QuestionThemeMongooseDocument | null>>;
};

function createMockedQuestionThemeMongooseModel(): MockedQuestionThemeMongooseModel {
  return {
    find: vi.fn<() => Promise<QuestionThemeMongooseDocument[]>>().mockResolvedValue([
      createFakeQuestionThemeDocument(),
      createFakeQuestionThemeDocument(),
      createFakeQuestionThemeDocument(),
    ]),
    findById: vi.fn<(id: string) => Promise<QuestionThemeMongooseDocument | null>>().mockResolvedValue(createFakeQuestionThemeDocument()),
    create: vi.fn<() => Promise<QuestionThemeMongooseDocument>>().mockResolvedValue(createFakeQuestionThemeDocument()),
    findByIdAndUpdate: vi.fn<(id: string) => Promise<QuestionThemeMongooseDocument | null>>().mockResolvedValue(createFakeQuestionThemeDocument()),
  };
}

export { createMockedQuestionThemeMongooseModel };