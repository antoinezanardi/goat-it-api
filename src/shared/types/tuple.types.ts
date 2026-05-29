/**
 * A readonly tuple type that enforces all members of a string union are present exactly once.
 * Generates a union of all valid permutations, preventing both missing values and duplicates at compile time.
 */
type ExhaustiveTuple<Union extends string> =
  [Union] extends [never] ?
    readonly [] :
    { [K in Union]: readonly [K, ...ExhaustiveTuple<Exclude<Union, K>>] }[Union];

export type { ExhaustiveTuple };