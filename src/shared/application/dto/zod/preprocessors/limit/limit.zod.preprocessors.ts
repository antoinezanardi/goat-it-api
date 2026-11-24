/**
 * Maps an empty or whitespace-only limit query value to `NaN`, so the coerced-number schema rejects it
 * instead of `Number("")` reading it as `0` (unlimited). Passes every other value through unchanged.
 * Used as a Zod preprocessor by `zLimit`.
 */
function normalizeBlankLimitToNaN(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? Number.NaN : value;
}

export { normalizeBlankLimitToNaN };