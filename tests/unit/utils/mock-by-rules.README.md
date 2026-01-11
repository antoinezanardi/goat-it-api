# Mock By Rules Helper

## Overview

`mockByRules` is a generic helper that allows defining mock behavior as a set of deterministic rules (`input → output`) **without any conditional logic inside the test itself**.

## Purpose

This helper was created to eliminate forbidden conditional logic in `mockImplementation` calls, which violates the `jest/no-conditional-in-test` linting rule.

## Location

`tests/unit/utils/mock-by-rules.helpers.ts`

## Usage

### Basic Example

```typescript
import { mockByRules } from "@unit-tests/utils/mock-by-rules.helpers";

const getMock = vi.fn().mockImplementation(
  mockByRules([
    [AppConfigService, mocks.services.config],
    [Logger, getMockedLoggerInstance()],
  ])
);
```

### With Default Value

```typescript
const getMock = vi.fn().mockImplementation(
  mockByRules([
    ["key1", "value1"],
    ["key2", "value2"],
  ], "default-value")
);
```

### With Type Parameters

```typescript
const getMock = vi.fn<(service: typeof AppConfigService | typeof Logger) => object>()
  .mockImplementation(
    mockByRules<typeof AppConfigService | typeof Logger, object>(
      [
        [AppConfigService, mocks.services.config],
        [Logger, getMockedLoggerInstance()],
      ],
      {}
    )
  );
```

## Features

- **Type-safe**: Full TypeScript support with proper type inference
- **Flexible**: Supports class references, primitives, and object references
- **Simple**: Uses strict equality (`===`) for matching
- **Predictable**: No conditional logic in test code
- **Default values**: Optional default value when no rule matches

## API

### `mockByRules<TInput, TOutput>(rules, defaultValue?)`

#### Parameters

- `rules`: `readonly MockRule<TInput, TOutput>[]` - Array of `[input, output]` tuples
- `defaultValue?`: `TOutput` - Optional default value to return when no rule matches

#### Returns

A function `(input: TInput) => TOutput | undefined` (or `TOutput` if default is provided)

## Type Definition

```typescript
type MockRule<TInput, TOutput> = readonly [TInput, TOutput];
```

## Examples of Refactoring

### Before (with conditional logic - forbidden)

```typescript
get: vi.fn<(service: typeof AppConfigService | typeof Logger) => object>()
  .mockImplementation(service => {
    if (service === AppConfigService) {
      return mocks.services.config;
    }
    if (service === Logger) {
      return getMockedLoggerInstance();
    }
    return {};
  })
```

### After (with mockByRules - clean)

```typescript
get: vi.fn<(service: typeof AppConfigService | typeof Logger) => object>()
  .mockImplementation(mockByRules<typeof AppConfigService | typeof Logger, object>(
    [
      [AppConfigService, mocks.services.config],
      [Logger, getMockedLoggerInstance()],
    ],
    {}
  ))
```

## Benefits

1. **No lint rule disables**: Eliminates the need for `/* oxlint-disable jest/no-conditional-in-test */`
2. **Cleaner tests**: Declarative rules are easier to read and maintain
3. **Type safety**: Full type checking with proper inference
4. **Extensible**: Easy to add new rules without modifying logic
5. **Predictable**: Simple matching semantics (strict equality)

## Notes

- The helper uses strict equality (`===`) for matching inputs
- For object references, the same instance must be passed (reference equality)
- **Important**: The first matching rule wins if multiple rules have the same input. To avoid confusion, ensure each input matcher is unique within the rules array
- When using with complex types, explicit type parameters may be needed for best type inference

### Gotchas

- **Duplicate matchers**: If you define multiple rules with the same input, only the first one will be used. This is intentional for simplicity but can lead to unexpected results if not careful:
  ```typescript
  // ❌ Bad - second rule will never be reached
  mockByRules([
    ["key", "value1"],
    ["key", "value2"],  // This rule is unreachable
  ])
  
  // ✅ Good - each input is unique
  mockByRules([
    ["key1", "value1"],
    ["key2", "value2"],
  ])
  ```
