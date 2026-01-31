import { COMPLETE_QUESTION_THEME_CREATION_PAYLOAD } from "@acceptance-support/payloads/question-theme/creation/complete-question-theme.create-payload";
import { COMPLETE_QUESTION_CREATION_PAYLOAD } from "@acceptance-support/payloads/question/creation/complete-question.create-payload";
import { PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD } from "@acceptance-support/payloads/question/question-theme-assignment/primary-history-question-theme-assignment.create-payload";

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
  },
  "question-theme-assignment": {
    creation: {
      primaryHistory: PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD,
    },
  },
} as const satisfies Record<PayloadScope, Record<PayloadType, Record<string, object>>>;

export {
  PAYLOADS,
};