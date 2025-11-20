type Lang = "en" | "fr" | "es" | "de" | "it" | "pt";

type LocalizedText = Record<Lang, string>;

type LocalizedTexts = Record<Lang, string[]>;

export type {
  Lang,
  LocalizedText,
  LocalizedTexts,
};