/**
 * Converts a tuple of strings into an enum-like object type.
 *
 * @template T - A readonly tuple of strings.
 *
 * @example
 * ```ts
 * const COLORS = ['RED', 'GREEN', 'BLUE'] as const;
 * type ColorEnum = TupleToEnum<typeof COLORS>;
 * // Resulting type:
 * // {
 * //   RED: 'RED';
 * //   GREEN: 'GREEN';
 * //   BLUE: 'BLUE';
 * // }
 * ```
 */
type TupleToEnum<T extends readonly string[]> = {
  [K in T[number]]: K
};

export type {
  TupleToEnum,
};