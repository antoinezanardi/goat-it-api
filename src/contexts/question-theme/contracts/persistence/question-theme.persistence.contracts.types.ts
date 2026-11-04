import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionThemePersistenceShape = {
  _id: { toString: () => string };
  slug: string;
  label: Partial<LocalizedText>;
  aliases: Partial<LocalizedTexts>;
  description: Partial<LocalizedText>;
  color?: string;
  status: QuestionThemeStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type { QuestionThemePersistenceShape };