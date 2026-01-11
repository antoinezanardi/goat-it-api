/**
 * A rule mapping an input value to an output value.
 * The first element is the input matcher, the second is the output value.
 */
type MockRule<TInput, TOutput> = readonly [TInput, TOutput];

/**
 * Creates a mock implementation function that matches inputs against predefined rules
 * and returns the corresponding output. This eliminates the need for conditional logic
 * in test mock implementations.
 *
 * @param rules - An array of [input, output] tuples defining the mock behavior
 * @param defaultValue - Optional default value to return when no rule matches (defaults to undefined)
 * @returns A function that can be used with vi.fn().mockImplementation()
 *
 * @example
 * ```ts
 * const getMock = vi.fn().mockImplementation(
 *   mockByRules([
 *     [AppConfigService, mocks.services.config],
 *     [Logger, getMockedLoggerInstance()],
 *   ])
 * );
 * ```
 */
function mockByRules<TInput, TOutput>(
  rules: readonly MockRule<TInput, TOutput>[],
): (input: TInput) => TOutput | undefined;

function mockByRules<TInput, TOutput>(
  rules: readonly MockRule<TInput, TOutput>[],
  defaultValue: TOutput,
): (input: TInput) => TOutput;

function mockByRules<TInput, TOutput>(
  rules: readonly MockRule<TInput, TOutput>[],
  defaultValue?: TOutput,
): (input: TInput) => TOutput | undefined {
  return (input: TInput): TOutput | undefined => {
    for (const [matcher, output] of rules) {
      if (matcher === input) {
        return output;
      }
    }
    return defaultValue;
  };
}

export type { MockRule };

export { mockByRules };