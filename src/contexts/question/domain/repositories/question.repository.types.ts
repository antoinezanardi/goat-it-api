import type { Question } from "@question/domain/entities/question.types";

type QuestionRepository = {
  findAll: () => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
};

export type { QuestionRepository };