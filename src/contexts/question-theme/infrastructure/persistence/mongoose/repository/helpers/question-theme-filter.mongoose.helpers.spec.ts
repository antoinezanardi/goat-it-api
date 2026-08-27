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

  it("should return status condition when status is defined.", () => {
    const result = buildQuestionThemeFilterQuery({ status: "active" });

    expect(result).toStrictEqual({ status: "active" });
  });

  it("should return translation completeness condition when isFullyTranslated is true.", () => {
    const filters: Partial<AdminQuestionThemeFilterOptions> = { isFullyTranslated: true };

    const result = buildQuestionThemeFilterQuery(filters);

    expect(result).toStrictEqual({
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
    });
  });

  it("should return translation completeness condition when isFullyTranslated is false.", () => {
    const filters: Partial<AdminQuestionThemeFilterOptions> = { isFullyTranslated: false };

    const result = buildQuestionThemeFilterQuery(filters);

    expect(result).toStrictEqual({
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
    });
  });

  it("should combine status and translation completeness conditions when both filters are provided.", () => {
    const filters: Partial<AdminQuestionThemeFilterOptions> = { status: "active", isFullyTranslated: true };

    const result = buildQuestionThemeFilterQuery(filters);

    expect(result).toStrictEqual({
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
    });
  });
});