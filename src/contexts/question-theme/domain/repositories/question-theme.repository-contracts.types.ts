import type { DEFAULT_QUESTION_THEME_STATUS } from "@question-theme/domain/constants/question-theme.constants";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionThemeCreationContract = {
  slug: string;
  label: Partial<LocalizedText>;
  aliases: Partial<LocalizedTexts>;
  description: Partial<LocalizedText>;
  color?: string;

  /**
   * New themes always start with the default status; archiving has its own repository operation.
   */
  status: typeof DEFAULT_QUESTION_THEME_STATUS;
};

/**
 * Partial theme modification: omitted fields keep their stored value, and `status` is absent because archiving is a separate operation.
 */
type QuestionThemeModificationContract = {
  slug?: string;
  label?: Partial<LocalizedText>;
  aliases?: Partial<LocalizedTexts>;
  description?: Partial<LocalizedText>;
  color?: string;
};

export type {
  QuestionThemeCreationContract,
  QuestionThemeModificationContract,
};