import { isSentryDsnValid } from "@src/infrastructure/api/config/validators/sentry-dsn.validator";

describe(isSentryDsnValid, () => {
  it.each<{
    test: string;
    value: string;
    isValid: boolean;
  }>([
    {
      test: "should return true for a DSN with a public key and a numeric project id.",
      value: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      isValid: true,
    },
    {
      test: "should return true for a DSN carrying a path before the project id.",
      value: "https://0123456789abcdef0123456789abcdef@o123456.ingest.sentry.io/sentry/4567890",
      isValid: true,
    },
    {
      test: "should return true for a DSN with a subdomain host.",
      value: "https://publickey@errors.goat-it.fr/1",
      isValid: true,
    },
    {
      test: "should return false for an empty string.",
      value: "",
      isValid: false,
    },
    {
      test: "should return false when the DSN has no scheme.",
      value: "publickey@sentry.io/42",
      isValid: false,
    },
    {
      test: "should return false for a DSN served over plain HTTP.",
      // Acceptable as this case must use plain HTTP to prove the predicate rejects it
      // eslint-disable-next-line unicorn/prefer-https
      value: "http://publickey@sentry.io/42",
      isValid: false,
    },
    {
      test: "should return false when the DSN has no public key.",
      value: "https://sentry.io/42",
      isValid: false,
    },
    {
      test: "should return false when the DSN has an empty public key.",
      value: "https://@sentry.io/42",
      isValid: false,
    },
    {
      test: "should return false when the DSN has no project id.",
      value: "https://publickey@sentry.io",
      isValid: false,
    },
    {
      test: "should return false when the DSN ends with a path separator.",
      value: "https://publickey@sentry.io/42/",
      isValid: false,
    },
    {
      test: "should return false when the DSN project id is not numeric.",
      value: "https://publickey@sentry.io/project",
      isValid: false,
    },
    {
      test: "should return false when the value is not a URL.",
      value: "sentry",
      isValid: false,
    },
  ])("$test", ({ value, isValid }) => {
    expect(isSentryDsnValid(value)).toBe(isValid);
  });
});