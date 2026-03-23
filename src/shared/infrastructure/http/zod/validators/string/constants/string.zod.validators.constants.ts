const SLUG_REGEX = /^[\da-z]+(?:-[\da-z]+)*$/u;

const MONGO_ID_REGEX = /^[\da-f]{24}$/iu;

const HEX_COLOR_REGEX = /^#[\dA-Fa-f]{6}$/u;

const SLUG_MIN_LENGTH = 3;

const SLUG_MAX_LENGTH = 50;

const ISO_DATE_TIME_EXAMPLE = "2026-04-14T00:00:00.000Z";

const HEX_COLOR_EXAMPLE = "#FF5733";

export {
  SLUG_REGEX,
  MONGO_ID_REGEX,
  HEX_COLOR_REGEX,
  SLUG_MIN_LENGTH,
  SLUG_MAX_LENGTH,
  ISO_DATE_TIME_EXAMPLE,
  HEX_COLOR_EXAMPLE,
};