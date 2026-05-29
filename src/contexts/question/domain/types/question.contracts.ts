import type { QuestionCategory, QuestionCognitiveDifficulty, QuestionCreationAuthorRole, QuestionCreationStatus } from "@question/domain/types/question.value-objects";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionAuthorCreationContract = {
  role: QuestionCreationAuthorRole;
  name: string;
};

type QuestionContentCreationContract = {
  statement: Partial<LocalizedText>;
  answer: Partial<LocalizedText>;
  context?: Partial<LocalizedText>;
  trivia?: Partial<LocalizedTexts>;
};

type QuestionThemeAssignmentCreationContract = {
  themeId: string;
  isHint: boolean;
  isPrimary: boolean;
};

type QuestionThemeAssignmentModificationContract = {
  isPrimary?: true;
  isHint?: boolean;
};

type QuestionCreationContract = {
  category: QuestionCategory;
  themes: QuestionThemeAssignmentCreationContract[];
  content: QuestionContentCreationContract;
  cognitiveDifficulty: QuestionCognitiveDifficulty;
  author: QuestionAuthorCreationContract;
  status: QuestionCreationStatus;
  sourceUrls: Set<string>;
};

type QuestionContentModificationContract = {
  statement?: Partial<LocalizedText>;
  answer?: Partial<LocalizedText>;
  context?: Partial<LocalizedText>;
  trivia?: Partial<LocalizedTexts>;
};

type QuestionModificationContract = {
  category?: QuestionCategory;
  cognitiveDifficulty?: QuestionCognitiveDifficulty;
  sourceUrls?: string[];
  content?: QuestionContentModificationContract;
};

export type {
  QuestionAuthorCreationContract,
  QuestionContentCreationContract,
  QuestionThemeAssignmentCreationContract,
  QuestionThemeAssignmentModificationContract,
  QuestionCreationContract,
  QuestionContentModificationContract,
  QuestionModificationContract,
};