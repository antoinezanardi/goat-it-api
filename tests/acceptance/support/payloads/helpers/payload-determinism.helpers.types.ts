import type { PayloadBuilder } from "@acceptance-support/payloads/types/payload.types";

type PayloadRegistry = Record<string, Record<string, Record<string, object>>>;

type PayloadBuilderRegistry = Record<string, Record<string, Record<string, PayloadBuilder>>>;

type PayloadCoordinate = {
  scope: string;
  type: string;
  name: string;
};

type PayloadEntry<T> = PayloadCoordinate & {
  value: T;
};

export type {
  PayloadBuilderRegistry,
  PayloadCoordinate,
  PayloadEntry,
  PayloadRegistry,
};