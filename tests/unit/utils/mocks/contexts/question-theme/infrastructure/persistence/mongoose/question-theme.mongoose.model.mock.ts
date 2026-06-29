import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";

import { createFakeQuestionThemeDocument } from "@faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";

import type { Mock } from "vitest";

type QuestionThemeMongooseFindQuery = Promise<QuestionThemeMongooseDocumentStub[]> & {
  sort: Mock<(sortOptions: unknown) => Promise<QuestionThemeMongooseDocumentStub[]>>;
  limit: Mock<(limit: number) => Promise<QuestionThemeMongooseDocumentStub[]>>;
};

type QuestionThemeMongooseModelStub = {
  find: (...arguments_: unknown[]) => QuestionThemeMongooseFindQuery;
  findOne: () => Promise<QuestionThemeMongooseDocumentStub | null>;
  findById: (id: string) => Promise<QuestionThemeMongooseDocumentStub | null>;
  create: () => Promise<QuestionThemeMongooseDocumentStub>;
  findByIdAndUpdate: (id: string, update: unknown, options?: unknown) => Promise<QuestionThemeMongooseDocumentStub | null>;
};

type MockedQuestionThemeMongooseModel = {
  find: Mock<QuestionThemeMongooseModelStub["find"]>;
  findQuery: QuestionThemeMongooseFindQuery;
  findOne: Mock<QuestionThemeMongooseModelStub["findOne"]>;
  findById: Mock<QuestionThemeMongooseModelStub["findById"]>;
  create: Mock<QuestionThemeMongooseModelStub["create"]>;
  findByIdAndUpdate: Mock<QuestionThemeMongooseModelStub["findByIdAndUpdate"]>;
};

function createQuestionThemeMongooseFindQuery(documents: QuestionThemeMongooseDocumentStub[]): QuestionThemeMongooseFindQuery {
  // Acceptable as mock utility creating a complex chainable Mongoose query object; direct type assertion is the standard pattern for this
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const self = Object.assign(Promise.resolve(documents)) as unknown as QuestionThemeMongooseFindQuery;

  const sortMock = vi.fn<(sortOptions: unknown) => Promise<QuestionThemeMongooseDocumentStub[]>>().mockReturnValue(self);
  const limitMock = vi.fn<(limit: number) => Promise<QuestionThemeMongooseDocumentStub[]>>().mockReturnValue(self);

  self.sort = sortMock;
  self.limit = limitMock;

  return self;
}

function createMockedQuestionThemeMongooseModel(overrides: Partial<MockedQuestionThemeMongooseModel> = {}): MockedQuestionThemeMongooseModel {
  const defaultDocuments = [
    createFakeQuestionThemeDocument(),
    createFakeQuestionThemeDocument(),
    createFakeQuestionThemeDocument(),
  ];
  const findQuery = overrides.findQuery ?? createQuestionThemeMongooseFindQuery(defaultDocuments);

  return {
    find: vi.fn<QuestionThemeMongooseModelStub["find"]>().mockReturnValue(findQuery),
    findQuery,
    findOne: vi.fn<QuestionThemeMongooseModelStub["findOne"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    findById: vi.fn<QuestionThemeMongooseModelStub["findById"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    create: vi.fn<QuestionThemeMongooseModelStub["create"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    findByIdAndUpdate: vi.fn<QuestionThemeMongooseModelStub["findByIdAndUpdate"]>().mockResolvedValue(createFakeQuestionThemeDocument()),
    ...overrides,
  };
}

export { createMockedQuestionThemeMongooseModel, createQuestionThemeMongooseFindQuery };