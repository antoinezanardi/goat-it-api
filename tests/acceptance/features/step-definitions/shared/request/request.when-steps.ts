import { When } from "@cucumber/cucumber";
import { construct, crush } from "radashi";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the request payload is overridden with the following values:$/u, function(this: GoatItWorld, overridesDataTable: DataTable): void {
  const overrideRows = overridesDataTable.hashes() as Record<"value" | "path", string>[];
  if (overrideRows.length === 0) {
    throw new Error("Overrides DataTable must contain at least one data row.");
  }
  const override = overrideRows.reduce<Record<string, unknown>>((accumulator, { value, path }) => {
    accumulator[path] = value;

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