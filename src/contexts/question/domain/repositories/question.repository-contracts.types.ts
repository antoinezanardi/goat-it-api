import type { QuestionCategory, QuestionCognitiveDifficulty, QuestionCreationAuthorRole, QuestionCreationStatus } from "@question/domain/types/question.value-objects";

import type { Locale, LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

/**
 * Author submitted when a question is created; the mapper derives the stored status from `role`.
 */
type QuestionAuthorCreationContract = {
  role: QuestionCreationAuthorRole;
  name: string;
};

/**
 * Content submitted when a question is created; every localized field may be partial because translations can be completed later.
 */
type QuestionContentCreationContract = {
  statement: Partial<LocalizedText>;
  answer: Partial<LocalizedText>;
  context?: Partial<LocalizedText>;
  trivia?: Partial<LocalizedTexts>;
};

type QuestionThemeAssignmentCreationContract = {
  themeId: string;
  isHint: boolean;

  /**
   * A primary assignment is exclusive: assigning one demotes the question's previous primary theme.
   */
  isPrimary: boolean;
};

/**
 * Partial theme-assignment modification: omitted fields keep their stored value.
 */
type QuestionThemeAssignmentModificationContract = {
  /**
   * Only `true` is accepted: an assignment can be promoted to primary but never demoted through this contract.
   */
  isPrimary?: true;
  isHint?: boolean;
};

type QuestionCreationContract = {
  category: QuestionCategory;
  themes: QuestionThemeAssignmentCreationContract[];
  content: QuestionContentCreationContract;
  cognitiveDifficulty: QuestionCognitiveDifficulty;
  isAdultContent: boolean;
  author: QuestionAuthorCreationContract;

  /**
   * Derived from the author role, not chosen by the client: an admin author yields an active question, any other role a pending one.
   */
  status: QuestionCreationStatus;

  /**
   * Stored as a set so duplicate URLs are dropped before persistence.
   */
  sourceUrls: Set<string>;

  /**
   * Locales the question is relevant for; omit it when the question applies to every supported locale.
   */
  applicableLocales?: Locale[];
};

/**
 * Content patch applied to a question; omitted fields and omitted locales keep their stored value.
 */
type QuestionContentModificationContract = {
  statement?: Partial<LocalizedText>;
  answer?: Partial<LocalizedText>;
  context?: Partial<LocalizedText>;
  trivia?: Partial<LocalizedTexts>;
};

/**
 * Partial question modification: omitted fields keep their stored value.
 */
type QuestionModificationContract = {
  category?: QuestionCategory;
  cognitiveDifficulty?: QuestionCognitiveDifficulty;
  isAdultContent?: boolean;

  /**
   * Replaces the stored source-URL list wholesale when provided.
   */
  sourceUrls?: string[];

  content?: QuestionContentModificationContract;

  /**
   * Omit it to leave the stored locales untouched; an empty array clears the restriction and targets every supported locale.
   */
  applicableLocales?: Locale[];
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