import { z } from "zod";

import { zQuestionApplicableLocales, zQuestionCategory, zQuestionCognitiveDifficulty, zQuestionSourceUrls } from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";
import { QUESTION_CONTENT_MODIFICATION_DTO } from "@question/application/dto/question-modification/question-content-modification/question-content-modification.dto.shape";

const QUESTION_MODIFICATION_DTO = z.object({
  category: zQuestionCategory()
    .optional(),
  cognitiveDifficulty: zQuestionCognitiveDifficulty()
    .optional(),
  sourceUrls: zQuestionSourceUrls()
    .optional(),
  content: QUESTION_CONTENT_MODIFICATION_DTO
    .optional(),
  applicableLocales: zQuestionApplicableLocales(0)
    .describe("Subset of locales this question is relevant for; submit an empty array to clear the restriction (all locales required again)"),
});

type QuestionModificationDto = z.infer<typeof QUESTION_MODIFICATION_DTO>;

export type { QuestionModificationDto };

export { QUESTION_MODIFICATION_DTO };