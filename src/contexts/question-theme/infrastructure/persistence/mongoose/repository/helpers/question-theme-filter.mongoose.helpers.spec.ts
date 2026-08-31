import { buildQuestionThemeFilterQuery } from "@question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme-filter.mongoose.helpers";

import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

describe("Build Question Theme Filter Query", () => {
  it("should return an empty object when called without arguments.", () => {
    const result = buildQuestionThemeFilterQuery();

    expect(result).toStrictEqual({});
  });

  it("should return an empty object when no filter fields are defined.", () => {
    const result = buildQuestionThemeFilterQuery({});

    expect(result).toStrictEqual({});
  });

  it.each<{ name: string; filters: Partial<AdminQuestionThemeFilterOptions>; expected: Record<string, unknown> }>([
    {
      name: "status only",
      filters: { status: "active" },
      expected: { status: "active" },
    },
    {
      name: "isFullyTranslated: true",
      filters: { isFullyTranslated: true },
      expected: {
        $and: [
          {
            "label.en": { $ne: null },
            "label.fr": { $ne: null },
            "label.es": { $ne: null },
            "label.de": { $ne: null },
            "label.it": { $ne: null },
            "label.pt": { $ne: null },
          },
          {
            "aliases.en": { $ne: null },
            "aliases.fr": { $ne: null },
            "aliases.es": { $ne: null },
            "aliases.de": { $ne: null },
            "aliases.it": { $ne: null },
            "aliases.pt": { $ne: null },
          },
          {
            "description.en": { $ne: null },
            "description.fr": { $ne: null },
            "description.es": { $ne: null },
            "description.de": { $ne: null },
            "description.it": { $ne: null },
            "description.pt": { $ne: null },
          },
        ],
      },
    },
    {
      name: "isFullyTranslated: false",
      filters: { isFullyTranslated: false },
      expected: {
        $or: [
          {
            $or: [
              { "label.en": null },
              { "label.fr": null },
              { "label.es": null },
              { "label.de": null },
              { "label.it": null },
              { "label.pt": null },
            ],
          },
          {
            $or: [
              { "aliases.en": null },
              { "aliases.fr": null },
              { "aliases.es": null },
              { "aliases.de": null },
              { "aliases.it": null },
              { "aliases.pt": null },
            ],
          },
          {
            $or: [
              { "description.en": null },
              { "description.fr": null },
              { "description.es": null },
              { "description.de": null },
              { "description.it": null },
              { "description.pt": null },
            ],
          },
        ],
      },
    },
    {
      name: "status and isFullyTranslated: true",
      filters: { status: "active", isFullyTranslated: true },
      expected: {
        status: "active",
        $and: [
          {
            "label.en": { $ne: null },
            "label.fr": { $ne: null },
            "label.es": { $ne: null },
            "label.de": { $ne: null },
            "label.it": { $ne: null },
            "label.pt": { $ne: null },
          },
          {
            "aliases.en": { $ne: null },
            "aliases.fr": { $ne: null },
            "aliases.es": { $ne: null },
            "aliases.de": { $ne: null },
            "aliases.it": { $ne: null },
            "aliases.pt": { $ne: null },
          },
          {
            "description.en": { $ne: null },
            "description.fr": { $ne: null },
            "description.es": { $ne: null },
            "description.de": { $ne: null },
            "description.it": { $ne: null },
            "description.pt": { $ne: null },
          },
        ],
      },
    },
  ])("should return expected query when filters include $name.", ({ filters, expected }) => {
    const result = buildQuestionThemeFilterQuery(filters);

    expect(result).toStrictEqual(expected);
  });
});