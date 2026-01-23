import { When } from "@cucumber/cucumber";
import { construct, crush } from "radashi";

import { REQUEST_PAYLOAD_OVERRIDE_ROW_SCHEMA } from "@acceptance-features/step-definitions/shared/request/datatables/request.datatables";
import { tryParseOverriddenPayloadValue } from "@acceptance-features/step-definitions/shared/request/helpers/request.steps.helpers";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

/**
 * Overrides specific values in the current request payload based on the provided data table.
 *
 * @param this - The GoatItWorld context.
 * @param overridesDataTable - The data table containing the override values.
 * @example
 * | path                 | type    | value                    |
 * | user.name            | string  | John Doe                 |
 * | user.age             | number  | 30                       |
 * | isActive             | boolean | true                     |
 * | tags                 | array   | ["tag1", "tag2", "tag3"] |
 * | socialMedias[0].url  | string  | "https://example.com"    |
 * @returns void
 *
 */
When(/^the request payload is overridden with the following values:$/u, function(this: GoatItWorld, overridesDataTable: DataTable): void {
  const overrideRows = validateDataTableAndGetRows(overridesDataTable, REQUEST_PAYLOAD_OVERRIDE_ROW_SCHEMA);
  const override = overrideRows.reduce<Record<string, unknown>>((accumulator, { path, type, value }) => {
    accumulator[path] = tryParseOverriddenPayloadValue(type, value);

    return accumulator;
  }, {});
  const crushedPayload = crush(this.payload);

  this.payload = {
    ...construct({
      ...crushedPayload,
      ...override,
    }),
  };
});