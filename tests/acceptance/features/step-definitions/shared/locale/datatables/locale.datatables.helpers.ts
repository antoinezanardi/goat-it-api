import { z } from "zod";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { ZLocalizedDataTableRowSchema } from "@acceptance-features/step-definitions/shared/locale/types/locale.datatables.types";

/**
 * Creates a Zod schema for a localized Cucumber data table row.
 * It suits for data tables where each row contains a locale and a localized field.
 *
 * Example:
 * ```gherkin
 * | locale | name          |
 * | en     | Example Name  |
 * | fr     | Nom d'Exemple |
 * ```
 * Here, `name` is the localized field.
 *
 * Only used in acceptance tests.
 * @param localizedField The name of the localized field (e.g., "name", "description").
 */
function createZLocalizedDataTableRowSchema<TField extends string>(localizedField: TField): ZLocalizedDataTableRowSchema<TField> {
  // This is acceptable because we are dynamically creating the schema based on the provided field name.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return z.strictObject({
    locale: z.enum(LOCALES),
    [localizedField]: z.string(),
  }) as ZLocalizedDataTableRowSchema<TField>;
}

export {
  createZLocalizedDataTableRowSchema,
};