import { z } from "zod";

import { zCoerceOptionalBoolean, zCoerceOptionalNumber, zCoerceOptionalString } from "@acceptance-support/helpers/datatable.helpers";

const REQUEST_PAYLOAD_OVERRIDE_ROW_SCHEMA = z.strictObject({
  path: z.string(),
  type: z.string(),
  value: z.string(),
});

const REQUEST_ERROR_ROW_SCHEMA = z.strictObject({
  error: z.string(),
  message: z.string(),
  statusCode: z.coerce.number(),
  validationDetails: zCoerceOptionalString(),
});

const REQUEST_VALIDATION_DETAILS_ROW_SCHEMA = z.strictObject({
  code: z.string(),
  message: z.string(),
  path: z.string(),
  expected: zCoerceOptionalString(),
  origin: zCoerceOptionalString(),
  format: zCoerceOptionalString(),
  pattern: zCoerceOptionalString(),
  minimum: zCoerceOptionalNumber(),
  maximum: zCoerceOptionalNumber(),
  inclusive: zCoerceOptionalBoolean(),
  keys: zCoerceOptionalString(),
});

export {
  REQUEST_PAYLOAD_OVERRIDE_ROW_SCHEMA,
  REQUEST_ERROR_ROW_SCHEMA,
  REQUEST_VALIDATION_DETAILS_ROW_SCHEMA,
};