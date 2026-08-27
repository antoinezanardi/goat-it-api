import { ZodError } from "zod";

import { zIsFullyTranslated, zTranslationCompletenessStats } from "@shared/infrastructure/http/zod/validators/translation-completeness/translation-completeness.zod.validators";

describe("Translation Completeness Zod Validators", () => {
  describe(zIsFullyTranslated, () => {
    it("should parse 'true' as true when input is the literal string true.", () => {
      const isFullyTranslated = zIsFullyTranslated().parse("true");

      expect(isFullyTranslated).toBeTruthy();
    });

    it("should parse 'false' as false when input is the literal string false.", () => {
      const isFullyTranslated = zIsFullyTranslated().parse("false");

      expect(isFullyTranslated).toBeFalsy();
    });

    it("should parse 'TRUE' as true when case is insensitive.", () => {
      const isFullyTranslated = zIsFullyTranslated().parse("TRUE");

      expect(isFullyTranslated).toBeTruthy();
    });

    it("should parse 'FALSE' as false when case is insensitive.", () => {
      const isFullyTranslated = zIsFullyTranslated().parse("FALSE");

      expect(isFullyTranslated).toBeFalsy();
    });

    it("should return undefined when input is undefined.", () => {
      const isFullyTranslated = zIsFullyTranslated().parse(undefined);

      expect(isFullyTranslated).toBeUndefined();
    });

    it("should throw a zod error when input is not a valid boolean string.", () => {
      expect(() => zIsFullyTranslated().parse("maybe")).toThrow(ZodError);
    });

    it("should throw a zod error when input is an empty string.", () => {
      expect(() => zIsFullyTranslated().parse("")).toThrow(ZodError);
    });

    it("should throw a zod error when input is a non-boolean truthy string like 'yes'.", () => {
      expect(() => zIsFullyTranslated().parse("yes")).toThrow(ZodError);
    });

    it("should throw a zod error when input is a non-boolean falsy string like 'no'.", () => {
      expect(() => zIsFullyTranslated().parse("no")).toThrow(ZodError);
    });

    it("should have the correct description when describing the schema.", () => {
      const description = zIsFullyTranslated().description;

      expect(description).toBe("Filters resources by whether every LocalizedText/LocalizedTexts field has all 6 supported locales set");
    });
  });

  describe(zTranslationCompletenessStats, () => {
    const validStats = { fullyTranslated: 2, incomplete: 3 };

    it("should pass validation when assigned valid values.", () => {
      expect(() => zTranslationCompletenessStats().parse(validStats)).not.toThrow();
    });

    it("should throw a zod error when fullyTranslated is missing.", () => {
      expect(() => zTranslationCompletenessStats().parse({ incomplete: 3 })).toThrow(ZodError);
    });

    it("should throw a zod error when incomplete is missing.", () => {
      expect(() => zTranslationCompletenessStats().parse({ fullyTranslated: 2 })).toThrow(ZodError);
    });

    it("should throw a zod error when fullyTranslated is negative.", () => {
      expect(() => zTranslationCompletenessStats().parse({ ...validStats, fullyTranslated: -1 })).toThrow(ZodError);
    });

    it("should throw a zod error when incomplete is not an integer.", () => {
      expect(() => zTranslationCompletenessStats().parse({ ...validStats, incomplete: 1.5 })).toThrow(ZodError);
    });

    it("should throw a zod error when an extra key is present.", () => {
      expect(() => zTranslationCompletenessStats().parse({ ...validStats, extra: true })).toThrow(ZodError);
    });

    it("should have the correct description when describing the fullyTranslated field.", () => {
      const schema = zTranslationCompletenessStats();

      expect(schema.shape.fullyTranslated.description).toBe("Number of resources that are fully translated across all locales");
    });

    it("should have the correct description when describing the incomplete field.", () => {
      const schema = zTranslationCompletenessStats();

      expect(schema.shape.incomplete.description).toBe("Number of resources missing at least one locale in at least one field");
    });
  });
});