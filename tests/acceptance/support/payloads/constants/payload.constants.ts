import { COMPLETE_QUESTION_THEME_CREATION_PAYLOAD } from "@acceptance-support/payloads/question-theme/creation/complete-question-theme.create-payload";
import { COMPLETE_QUESTION_CREATION_PAYLOAD } from "@acceptance-support/payloads/question/creation/complete-question.create-payload";
import { COMPLETE_QUESTION_MODIFICATION_PAYLOAD } from "@acceptance-support/payloads/question/modification/complete-question.modify-payload";
import { PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD } from "@acceptance-support/payloads/question/question-theme-assignment/primary-history-question-theme-assignment.create-payload";
import { PROMOTE_TO_PRIMARY_QUESTION_THEME_ASSIGNMENT_MODIFY_PAYLOAD } from "@acceptance-support/payloads/question/question-theme-assignment/promote-to-primary-question-theme-assignment.modify-payload";

import type { PayloadScope, PayloadType } from "@acceptance-support/payloads/types/payload.types";

const PAYLOADS = {
  "question-theme": {
    creation: {
      complete: COMPLETE_QUESTION_THEME_CREATION_PAYLOAD,
    },
  },
  "question": {
    creation: {
      complete: COMPLETE_QUESTION_CREATION_PAYLOAD,
    },
    modification: {
      complete: COMPLETE_QUESTION_MODIFICATION_PAYLOAD,
    },
  },
  "question-theme-assignment": {
    creation: {
      primaryHistory: PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD,
    },
    modification: {
      promoteToPrimary: PROMOTE_TO_PRIMARY_QUESTION_THEME_ASSIGNMENT_MODIFY_PAYLOAD,
    },
  },
} as const satisfies Record<PayloadScope, Partial<Record<PayloadType, Record<string, object>>>>;

export {
  PAYLOADS,
};