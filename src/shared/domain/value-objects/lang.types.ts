type Lang = "en" | "fr";

type LocalizedText = Record<Lang, string>;

type LocalizedTexts = Record<Lang, string[]>;

export type {
  Lang,
  LocalizedText,
  LocalizedTexts,
};