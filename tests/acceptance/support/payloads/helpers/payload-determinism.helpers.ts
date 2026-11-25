import { PAYLOAD_DETERMINISM_BUILD_COUNT } from "@acceptance-support/constants/payload-determinism.constants";
import { PAYLOAD_BUILDERS } from "@acceptance-support/payloads/constants/payload-builders.constants";
import { PAYLOADS } from "@acceptance-support/payloads/constants/payload.constants";

import type { PayloadBuilder } from "@acceptance-support/payloads/types/payload.types";

type PayloadRegistry = Record<string, Record<string, Record<string, object>>>;

type PayloadBuilderRegistry = Record<string, Record<string, Record<string, PayloadBuilder>>>;

function assertEveryRegisteredPayloadHasABuilder(payloadRegistry: PayloadRegistry, builderRegistry: PayloadBuilderRegistry): void {
  for (const [scope, payloadTypes] of Object.entries(payloadRegistry)) {
    for (const [type, namedPayloads] of Object.entries(payloadTypes)) {
      for (const name of Object.keys(namedPayloads)) {
        const hasBuilder = Object.hasOwn(builderRegistry, scope) &&
          Object.hasOwn(builderRegistry[scope], type) &&
          Object.hasOwn(builderRegistry[scope][type], name);

        if (!hasBuilder) {
          throw new Error(`Acceptance payload "${scope}/${type}/${name}" has no builder in PAYLOAD_BUILDERS, so its determinism is unchecked.`);
        }
      }
    }
  }
}

function assertPayloadBuildersAreDeterministic(builderRegistry: PayloadBuilderRegistry): void {
  for (const [scope, payloadTypeBuilders] of Object.entries(builderRegistry)) {
    for (const [type, namedPayloadBuilders] of Object.entries(payloadTypeBuilders)) {
      for (const [name, buildPayload] of Object.entries(namedPayloadBuilders)) {
        const serializedBuilds = new Set(Array.from({ length: PAYLOAD_DETERMINISM_BUILD_COUNT }, () => JSON.stringify(buildPayload())));

        if (serializedBuilds.size > 1) {
          throw new Error(`Acceptance payload "${scope}/${type}/${name}" is not deterministic (${serializedBuilds.size} distinct bodies across ${PAYLOAD_DETERMINISM_BUILD_COUNT} builds): override every faketory-randomised field with a concrete value.`);
        }
      }
    }
  }
}

function assertPayloadsAreDeterministic(): void {
  assertEveryRegisteredPayloadHasABuilder(PAYLOADS, PAYLOAD_BUILDERS);
  assertPayloadBuildersAreDeterministic(PAYLOAD_BUILDERS);
}

export { assertPayloadsAreDeterministic };