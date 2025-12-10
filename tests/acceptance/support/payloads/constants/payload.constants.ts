import { COMPLETE_QUESTION_THEME_CREATION_PAYLOAD } from "@acceptance-support/payloads/question-theme/creation/complete-question-theme.create-payload";

import type { PayloadScope, PayloadType } from "@acceptance-support/payloads/types/payload.types";

const PAYLOADS = {
  "question-theme": {
    creation: {
      complete: COMPLETE_QUESTION_THEME_CREATION_PAYLOAD,
    },
  },
} as const satisfies Record<PayloadScope, Record<PayloadType, Record<string, object>>>;

export {
  PAYLOADS,
};