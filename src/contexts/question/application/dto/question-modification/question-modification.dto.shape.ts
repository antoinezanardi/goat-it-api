import { z } from "zod";

import { zQuestionApplicableLocales, zQuestionCategory, zQuestionCognitiveDifficulty, zQuestionIsAdultContent, zQuestionSourceUrls } from "@question/application/dto/zod/validators/question.dto.zod.validators";
import { QUESTION_CONTENT_MODIFICATION_DTO } from "@question/application/dto/question-modification/question-content-modification/question-content-modification.dto.shape";

/**
 * Validates a partial question modification: every field is optional, and an empty `applicableLocales` array clears the locale restriction.
 */
const QUESTION_MODIFICATION_DTO = z.object({
  category: zQuestionCategory()
    .optional(),
  cognitiveDifficulty: zQuestionCognitiveDifficulty()
    .optional(),
  isAdultContent: zQuestionIsAdultContent()
    .optional(),
  sourceUrls: zQuestionSourceUrls()
    .optional(),
  content: QUESTION_CONTENT_MODIFICATION_DTO
    .optional(),
  applicableLocales: zQuestionApplicableLocales(0)
    .describe("Subset of locales this question is relevant for; submit an empty array to clear the restriction (all locales required again)"),
});

/**
 * The validated partial modification consumers receive, where omitted fields are left out of the patch update.
 */
type QuestionModificationDto = z.infer<typeof QUESTION_MODIFICATION_DTO>;

export type { QuestionModificationDto };

export { QUESTION_MODIFICATION_DTO };