import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import type { QuestionCreationContract } from "@question/domain/contracts/question.contracts";

import type { Question } from "@question/domain/entities/question.types";

type QuestionRepository = {
  findAll: () => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;
  archive: (id: string) => Promise<Question | undefined>;
  assignTheme: (questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract) => Promise<Question | undefined>;
};

export type { QuestionRepository };