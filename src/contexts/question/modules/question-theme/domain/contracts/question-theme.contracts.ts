import type { DEFAULT_QUESTION_THEME_STATUS } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionThemeCreationContract = {
  slug: string;
  label: Partial<LocalizedText>;
  aliases: Partial<LocalizedTexts>;
  description: Partial<LocalizedText>;
  color?: string;
  status: typeof DEFAULT_QUESTION_THEME_STATUS;
};

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