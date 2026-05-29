import type { UnionToTuple } from "type-fest";

/**
 * A readonly array type that enforces all members of a string union are present exactly once.
 * Uses `UnionToTuple` length check to prevent missing values and duplicates at compile time.
 */
type ExhaustiveTuple<Union extends string> = readonly Union[] & { length: UnionToTuple<Union>["length"] };

export type { ExhaustiveTuple };