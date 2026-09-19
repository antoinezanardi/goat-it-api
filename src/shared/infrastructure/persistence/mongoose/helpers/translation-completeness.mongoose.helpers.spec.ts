import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";
import { buildIsFullyTranslatedMatchCondition, buildIsFullyTranslatedForLocaleMatchCondition } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";
import type { TranslationCompletenessFieldSpec } from "@shared/infrastructure/persistence/mongoose/types/translation-completeness.mongoose.types";

describe(buildIsFullyTranslatedMatchCondition, () => {
  const mandatoryFieldSpec: TranslationCompletenessFieldSpec = { path: "label", isMandatory: true };
  const optionalFieldSpec: TranslationCompletenessFieldSpec = { path: "content.context", isMandatory: false };

  it.each<{
    name: string;
    specs: TranslationCompletenessFieldSpec[];
    isFullyTranslated: boolean;
    expected: Record<string, unknown>;
  }>([
    {
      name: "single mandatory field when true",
      specs: [mandatoryFieldSpec],
      isFullyTranslated: true,
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
        ],
      },
    },
    {
      name: "single mandatory field when false",
      specs: [mandatoryFieldSpec],
      isFullyTranslated: false,
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
        ],
      },
    },
    {
      name: "single optional field when true",
      specs: [optionalFieldSpec],
      isFullyTranslated: true,
      expected: {
        $and: [
          {
            $or: [
              { "content.context": null },
              {
                "content.context.en": { $ne: null },
                "content.context.fr": { $ne: null },
                "content.context.es": { $ne: null },
                "content.context.de": { $ne: null },
                "content.context.it": { $ne: null },
                "content.context.pt": { $ne: null },
              },
            ],
          },
        ],
      },
    },
    {
      name: "single optional field when false",
      specs: [optionalFieldSpec],
      isFullyTranslated: false,
      expected: {
        $or: [
          {
            $and: [
              { "content.context": { $ne: null } },
              {
                $or: [
                  { "content.context.en": null },
                  { "content.context.fr": null },
                  { "content.context.es": null },
                  { "content.context.de": null },
                  { "content.context.it": null },
                  { "content.context.pt": null },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      name: "two fields (mandatory + optional) when true",
      specs: [mandatoryFieldSpec, optionalFieldSpec],
      isFullyTranslated: true,
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
            $or: [
              { "content.context": null },
              {
                "content.context.en": { $ne: null },
                "content.context.fr": { $ne: null },
                "content.context.es": { $ne: null },
                "content.context.de": { $ne: null },
                "content.context.it": { $ne: null },
                "content.context.pt": { $ne: null },
              },
            ],
          },
        ],
      },
    },
    {
      name: "two fields (mandatory + optional) when false",
      specs: [mandatoryFieldSpec, optionalFieldSpec],
      isFullyTranslated: false,
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
            $and: [
              { "content.context": { $ne: null } },
              {
                $or: [
                  { "content.context.en": null },
                  { "content.context.fr": null },
                  { "content.context.es": null },
                  { "content.context.de": null },
                  { "content.context.it": null },
                  { "content.context.pt": null },
                ],
              },
            ],
          },
        ],
      },
    },
  ])("should return expected condition when $name.", ({ specs, isFullyTranslated, expected }) => {
    const result = buildIsFullyTranslatedMatchCondition(specs, isFullyTranslated);

    expect(result).toStrictEqual(expected);
  });

  it("should return an $expr condition using applicableLocalesPath when third argument is provided and isFullyTranslated is true.", () => {
    const result = buildIsFullyTranslatedMatchCondition([mandatoryFieldSpec], true, "$applicableLocales");

    expect(result).toStrictEqual({
      $expr: {
        $and: [
          {
            $allElementsTrue: [
              {
                $map: {
                  input: {
                    $cond: [
                      { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                      LOCALES,
                      "$applicableLocales",
                    ],
                  },
                  as: "locale",
                  in: {
                    $gt: [{ $getField: { field: "$$locale", input: "$label" } }, null],
                  },
                },
              },
            ],
          },
        ],
      },
    });
  });

  it("should return an $expr condition with optional field semantics when isFullyTranslated is true and field is optional.", () => {
    const result = buildIsFullyTranslatedMatchCondition([optionalFieldSpec], true, "$applicableLocales");

    expect(result).toStrictEqual({
      $expr: {
        $and: [
          {
            $or: [
              { $not: { $gt: ["$content.context", null] } },
              {
                $allElementsTrue: [
                  {
                    $map: {
                      input: {
                        $cond: [
                          { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                          LOCALES,
                          "$applicableLocales",
                        ],
                      },
                      as: "locale",
                      in: {
                        $gt: [{ $getField: { field: "$$locale", input: "$content.context" } }, null],
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });

  it("should return an $expr condition with mandatory incomplete semantics when isFullyTranslated is false.", () => {
    const result = buildIsFullyTranslatedMatchCondition([mandatoryFieldSpec], false, "$applicableLocales");

    expect(result).toStrictEqual({
      $expr: {
        $or: [
          {
            $anyElementTrue: [
              {
                $map: {
                  input: {
                    $cond: [
                      { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                      LOCALES,
                      "$applicableLocales",
                    ],
                  },
                  as: "locale",
                  in: {
                    $not: { $gt: [{ $getField: { field: "$$locale", input: "$label" } }, null] },
                  },
                },
              },
            ],
          },
        ],
      },
    });
  });

  it("should return an $expr condition with optional incomplete semantics when isFullyTranslated is false and field is optional.", () => {
    const result = buildIsFullyTranslatedMatchCondition([optionalFieldSpec], false, "$applicableLocales");

    expect(result).toStrictEqual({
      $expr: {
        $or: [
          {
            $and: [
              { $gt: ["$content.context", null] },
              {
                $anyElementTrue: [
                  {
                    $map: {
                      input: {
                        $cond: [
                          { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                          LOCALES,
                          "$applicableLocales",
                        ],
                      },
                      as: "locale",
                      in: {
                        $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.context" } }, null] },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });
});

describe(buildIsFullyTranslatedForLocaleMatchCondition, () => {
  const mandatoryFieldSpec: TranslationCompletenessFieldSpec = { path: "label", isMandatory: true };
  const optionalFieldSpec: TranslationCompletenessFieldSpec = { path: "content.context", isMandatory: false };

  it.each<{
    name: string;
    specs: TranslationCompletenessFieldSpec[];
    locale: Locale;
    expected: Record<string, unknown>;
  }>([
    {
      name: "a single mandatory field",
      specs: [mandatoryFieldSpec],
      locale: "it",
      expected: {
        $and: [{ "label.it": { $ne: null } }],
      },
    },
    {
      name: "a single mandatory field for another locale",
      specs: [mandatoryFieldSpec],
      locale: "fr",
      expected: {
        $and: [{ "label.fr": { $ne: null } }],
      },
    },
    {
      name: "a single optional field",
      specs: [optionalFieldSpec],
      locale: "it",
      expected: {
        $and: [
          {
            $or: [
              { "content.context": null },
              { "content.context.it": { $ne: null } },
            ],
          },
        ],
      },
    },
    {
      name: "a mandatory and an optional field",
      specs: [mandatoryFieldSpec, optionalFieldSpec],
      locale: "de",
      expected: {
        $and: [
          { "label.de": { $ne: null } },
          {
            $or: [
              { "content.context": null },
              { "content.context.de": { $ne: null } },
            ],
          },
        ],
      },
    },
    {
      name: "no field spec",
      specs: [],
      locale: "it",
      expected: { $and: [] },
    },
  ])("should return expected condition when specs are $name.", ({ specs, locale, expected }) => {
    const result = buildIsFullyTranslatedForLocaleMatchCondition(specs, locale);

    expect(result).toStrictEqual(expected);
  });

  it("should not return an $expr condition when called.", () => {
    const result = buildIsFullyTranslatedForLocaleMatchCondition([mandatoryFieldSpec, optionalFieldSpec], "it");

    expect(result).not.toHaveProperty("$expr");
  });
});