import { CORS_URL_SCHEMA } from "@src/infrastructure/api/config/validators/constants/cors.validator.constants";

function isCorsOriginValid(value: string): boolean {
  if (value === "*") {
    return true;
  }
  return CORS_URL_SCHEMA.validate(value);
}

export { isCorsOriginValid };