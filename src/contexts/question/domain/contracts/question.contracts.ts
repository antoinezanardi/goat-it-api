import type { QuestionAuthorCreationContract } from "@question/domain/contracts/question-author/question-author.contracts";
import type { QuestionContentCreationContract } from "@question/domain/contracts/question-content/question-content.contracts";
import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";

import type { QuestionCognitiveDifficulty } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.types";
import type { QuestionCreationStatus } from "@question/domain/value-objects/question-status/question-status.types";

type QuestionCreationContract = {
  themes: QuestionThemeAssignmentCreationContract[];
  content: QuestionContentCreationContract;
  cognitiveDifficulty: QuestionCognitiveDifficulty;
  author: QuestionAuthorCreationContract;
  status: QuestionCreationStatus;
};

export type {
  QuestionCreationContract,
};