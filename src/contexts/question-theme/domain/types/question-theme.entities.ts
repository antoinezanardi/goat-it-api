import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionTheme = {
  readonly id: string;
  readonly slug: string;
  readonly label: Partial<LocalizedText>;
  readonly aliases: Partial<LocalizedTexts>;
  readonly description: Partial<LocalizedText>;
  readonly color?: string;
  readonly status: QuestionThemeStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type {
  QuestionTheme,
};