import type { QuestionCreationContract } from "@question/domain/contracts/question.contracts";

import type { Question } from "@question/domain/entities/question.types";

type QuestionRepository = {
  findAll: () => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;
};

export type { QuestionRepository };