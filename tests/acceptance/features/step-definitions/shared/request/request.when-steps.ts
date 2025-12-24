import { When } from "@cucumber/cucumber";
import { construct, crush } from "radashi";

import { REQUEST_PAYLOAD_OVERRIDE_ROW_SCHEMA } from "@acceptance-features/step-definitions/shared/request/datatables/request.datatables";
import { tryParseOverriddenPayloadValue } from "@acceptance-features/step-definitions/shared/request/helpers/request.steps.helpers";

import { validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

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