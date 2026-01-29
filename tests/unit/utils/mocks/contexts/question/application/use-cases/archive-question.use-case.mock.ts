import { QUESTION_STATUS_ARCHIVED } from "@question/domain/value-objects/question-status/question-status.constants";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type ArchiveQuestionStub = {
  archive: (id: string) => Promise<Question>;
};

type MockedArchiveQuestionUseCase = { [K in keyof ArchiveQuestionStub]: Mock<ArchiveQuestionStub[K]> };

function createMockedArchiveQuestionUseCase(overrides: Partial<MockedArchiveQuestionUseCase> = {}): MockedArchiveQuestionUseCase {
  return {
    archive: vi.fn<ArchiveQuestionStub["archive"]>().mockResolvedValue(createFakeQuestion({ status: QUESTION_STATUS_ARCHIVED })),
    ...overrides,
  };
}

export { createMockedArchiveQuestionUseCase };