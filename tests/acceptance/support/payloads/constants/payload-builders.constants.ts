import { buildCompleteQuestionThemeCreationPayload } from "@acceptance-support/payloads/question-theme/creation/complete-question-theme.create-payload";
import { buildCompleteQuestionCreationPayload } from "@acceptance-support/payloads/question/creation/complete-question.create-payload";
import { buildCompleteQuestionModificationPayload } from "@acceptance-support/payloads/question/modification/complete-question.modify-payload";
import { buildPrimaryHistoryQuestionThemeAssignmentCreatePayload } from "@acceptance-support/payloads/question/question-theme-assignment/primary-history-question-theme-assignment.create-payload";
import { buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload } from "@acceptance-support/payloads/question/question-theme-assignment/promote-to-primary-question-theme-assignment.modify-payload";

import type { PayloadBuilders } from "@acceptance-support/payloads/types/payload.types";

const PAYLOAD_BUILDERS = {
  "question-theme": {
    creation: { complete: buildCompleteQuestionThemeCreationPayload },
  },
  "question": {
    creation: { complete: buildCompleteQuestionCreationPayload },
    modification: { complete: buildCompleteQuestionModificationPayload },
  },
  "question-theme-assignment": {
    creation: { primaryHistory: buildPrimaryHistoryQuestionThemeAssignmentCreatePayload },
    modification: { promoteToPrimary: buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload },
  },
} as const satisfies PayloadBuilders;

export { PAYLOAD_BUILDERS };