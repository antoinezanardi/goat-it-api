type PayloadScope = "question-theme" | "question" | "question-theme-assignment";

type PayloadType = "creation" | "modification";

type PayloadBuilder = () => object;

type PayloadBuilders = Record<PayloadScope, Partial<Record<PayloadType, Record<string, PayloadBuilder>>>>;

export type {
  PayloadBuilder,
  PayloadBuilders,
  PayloadScope,
  PayloadType,
};