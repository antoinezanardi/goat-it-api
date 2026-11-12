import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

/**
 * Structural shape of a stored question theme, published so the `question` context can read theme fields without importing the Mongoose schema.
 *
 * `_id` exposes only `toString()` because the persistence mapper needs the id string and must stay free of Mongoose types.
 */
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