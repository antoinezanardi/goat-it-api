import {
  SENTRY_DSN_PATH_SEGMENT_SEPARATOR,
  SENTRY_DSN_PROJECT_ID_REGEX,
  SENTRY_DSN_URL_SCHEMA,
} from "@src/infrastructure/api/config/validators/constants/sentry-dsn.validator.constants";

/**
 * Tells whether a value is a complete Sentry DSN: an HTTPS URL carrying a public key, a host and a numeric project id, without surrounding whitespace.
 *
 * The empty string is rejected here; `APP_ENV_SCHEMA` owns the default-off empty value.
 */
function isSentryDsnValid(value: string): boolean {
  if (value !== value.trim() || !SENTRY_DSN_URL_SCHEMA.safeParse(value).success) {
    return false;
  }
  const sentryDsnUrl = new URL(value);
  const projectId = sentryDsnUrl.pathname.split(SENTRY_DSN_PATH_SEGMENT_SEPARATOR).at(-1);

  return sentryDsnUrl.username !== "" && projectId !== undefined && SENTRY_DSN_PROJECT_ID_REGEX.test(projectId);
}

export { isSentryDsnValid };