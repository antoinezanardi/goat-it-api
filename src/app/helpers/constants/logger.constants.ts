import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";

const LOGGER_REDACTION_CENSOR = "[REDACTED]";

const LOGGER_CREDENTIAL_FIELD_NAMES = [
  "authorization",
  "cookie",
  "apiKey",
  "gameKey",
  "token",
  "password",
  "secret",
  "apiKeyHash",
  "hmacSecret",
] as const;

const LOGGER_REDACTION_PATHS = [
  "headers",
  "*.headers",
  "*.*.headers",
  `["${API_KEY_HEADER}"]`,
  `*.headers["${API_KEY_HEADER}"]`,
  "req.remoteAddress",
  "req.remotePort",
  "*.remoteAddress",
  "*.remotePort",
  ...LOGGER_CREDENTIAL_FIELD_NAMES,
  ...LOGGER_CREDENTIAL_FIELD_NAMES.map(name => `*.${name}`),
  ...LOGGER_CREDENTIAL_FIELD_NAMES.map(name => `*.*.${name}`),
] as const;

export {
  LOGGER_REDACTION_CENSOR,
  LOGGER_REDACTION_PATHS,
};