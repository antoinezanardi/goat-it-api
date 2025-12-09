import { Given } from "@cucumber/cucumber";

import { PAYLOADS } from "@acceptance-support/payloads/constants/payload.constants";

import type { PayloadScope, PayloadType } from "@acceptance-support/payloads/types/payload.types";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the request payload is set from scope "(?<scope>[^"]+)", type "(?<type>[^"]+)" and name "(?<name>[^"]+)"$/u, function(this: GoatItWorld, scope: PayloadScope, type: PayloadType, name: string): void {
  const scopedPayloads = (PAYLOADS as Record<string, Record<string, Record<string, Record<string, unknown> | undefined>>>)[scope];
  const typePayloads = scopedPayloads[type];
  const payload = typePayloads[name];
  if (!payload) {
    throw new Error(`No payload found for scope "${scope}", type "${type}" and name "${name}". Please check the payloads constants.`);
  }

  this.payload = payload;
});