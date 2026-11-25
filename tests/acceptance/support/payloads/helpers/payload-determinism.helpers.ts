import { PAYLOAD_DETERMINISM_BUILD_COUNT } from "@acceptance-support/constants/payload-determinism.constants";
import { PAYLOAD_BUILDERS } from "@acceptance-support/payloads/constants/payload-builders.constants";
import { PAYLOADS } from "@acceptance-support/payloads/constants/payload.constants";

import type { PayloadBuilderRegistry, PayloadCoordinate, PayloadEntry, PayloadRegistry } from "@acceptance-support/payloads/helpers/payload-determinism.helpers.types";

function createPayloadEntriesOfType<T>(scope: string, type: string, namedPayloads: Record<string, T>): PayloadEntry<T>[] {
  return Object.entries(namedPayloads).map(([name, value]) => ({ scope, type, name, value }));
}

function createPayloadEntriesOfScope<T>(scope: string, payloadTypes: Record<string, Record<string, T>>): PayloadEntry<T>[] {
  return Object.entries(payloadTypes).flatMap(([type, namedPayloads]) => createPayloadEntriesOfType(scope, type, namedPayloads));
}

function flattenPayloadRegistry<T>(payloadRegistry: Record<string, Record<string, Record<string, T>>>): PayloadEntry<T>[] {
  return Object.entries(payloadRegistry).flatMap(([scope, payloadTypes]) => createPayloadEntriesOfScope(scope, payloadTypes));
}

function formatPayloadCoordinate({ scope, type, name }: PayloadCoordinate): string {
  return `${scope}/${type}/${name}`;
}

/**
 * Fails when a payload registered in `PAYLOADS` has no matching builder in `PAYLOAD_BUILDERS`.
 *
 * @throws `Error` naming the payload, because an unbuilt payload is never checked for determinism.
 */
function assertEveryRegisteredPayloadHasABuilder(payloadRegistry: PayloadRegistry, builderRegistry: PayloadBuilderRegistry): void {
  const builderCoordinates = new Set(flattenPayloadRegistry(builderRegistry).map(formatPayloadCoordinate));
  const payloadWithoutBuilder = flattenPayloadRegistry(payloadRegistry).find(payload => !builderCoordinates.has(formatPayloadCoordinate(payload)));

  if (payloadWithoutBuilder) {
    throw new Error(`Acceptance payload "${formatPayloadCoordinate(payloadWithoutBuilder)}" has no builder in PAYLOAD_BUILDERS, so its determinism is unchecked.`);
  }
}

/**
 * Fails when any builder serializes to more than one distinct body across `PAYLOAD_DETERMINISM_BUILD_COUNT` rebuilds.
 *
 * @throws `Error` naming the payload, its distinct-body count and the faketory-randomised fields to override.
 */
function assertPayloadBuildersAreDeterministic(builderRegistry: PayloadBuilderRegistry): void {
  for (const { scope, type, name, value: buildPayload } of flattenPayloadRegistry(builderRegistry)) {
    const serializedBuilds = new Set(Array.from({ length: PAYLOAD_DETERMINISM_BUILD_COUNT }, () => JSON.stringify(buildPayload())));

    if (serializedBuilds.size > 1) {
      throw new Error(`Acceptance payload "${formatPayloadCoordinate({ scope, type, name })}" is not deterministic (${serializedBuilds.size} distinct bodies across ${PAYLOAD_DETERMINISM_BUILD_COUNT} builds): override every faketory-randomised field with a concrete value.`);
    }
  }
}

/**
 * Asserts that every registered payload has a builder and that every builder produces a deterministic body.
 *
 * @throws `Error` when a payload has no builder or when a builder is non-deterministic.
 */
function assertPayloadsAreDeterministic(): void {
  assertEveryRegisteredPayloadHasABuilder(PAYLOADS, PAYLOAD_BUILDERS);
  assertPayloadBuildersAreDeterministic(PAYLOAD_BUILDERS);
}

export { assertPayloadsAreDeterministic };