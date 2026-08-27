import { buildIsFullyTranslatedMatchCondition } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";
import type { TranslationCompletenessFieldSpec } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";

describe("Build Is Fully Translated Match Condition", () => {
  const mandatoryFieldSpec: TranslationCompletenessFieldSpec = { path: "label", isMandatory: true };
  const optionalFieldSpec: TranslationCompletenessFieldSpec = { path: "content.context", isMandatory: false };

  it("should return an $and of all locale non-null conditions for a single mandatory field when true.", () => {
    const result = buildIsFullyTranslatedMatchCondition([mandatoryFieldSpec], true);

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
      ],
    });
  });

  it("should return an $or of locale null conditions for a single mandatory field when false.", () => {
    const result = buildIsFullyTranslatedMatchCondition([mandatoryFieldSpec], false);

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
      ],
    });
  });

  it("should allow optional field to be absent when true.", () => {
    const result = buildIsFullyTranslatedMatchCondition([optionalFieldSpec], true);

    expect(result).toStrictEqual({
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
    });
  });

  it("should require optional field to be present but incomplete when false.", () => {
    const result = buildIsFullyTranslatedMatchCondition([optionalFieldSpec], false);

    expect(result).toStrictEqual({
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
    });
  });

  it("should combine multiple field specs when true.", () => {
    const result = buildIsFullyTranslatedMatchCondition([mandatoryFieldSpec, optionalFieldSpec], true);

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
    });
  });

  it("should combine multiple field specs when false.", () => {
    const result = buildIsFullyTranslatedMatchCondition([mandatoryFieldSpec, optionalFieldSpec], false);

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
    });
  });
});