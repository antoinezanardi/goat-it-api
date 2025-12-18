import { When } from "@cucumber/cucumber";
import { construct, crush } from "radashi";

import { tryParseOverriddenPayloadValue } from "@acceptance-features/step-definitions/shared/request/helpers/request.steps.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the request payload is overridden with the following values:$/u, function(this: GoatItWorld, overridesDataTable: DataTable): void {
  const overrideRows = overridesDataTable.hashes() as Record<"path" | "type" | "value", string>[];
  if (overrideRows.length === 0) {
    throw new Error("Overrides DataTable must contain at least one data row.");
  }
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