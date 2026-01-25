import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionContentCreationContract = {
  statement: Partial<LocalizedText>;
  answer: Partial<LocalizedText>;
  context?: Partial<LocalizedText>;
  trivia?: Partial<LocalizedTexts>;
};

export type {
  QuestionContentCreationContract,
};