type TupleToEnum<T extends readonly string[]> = {
  [K in T[number]]: K
};

export type {
  TupleToEnum,
};