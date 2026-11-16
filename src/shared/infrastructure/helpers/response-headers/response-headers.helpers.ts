import {
  ACCEPT_LANGUAGE_VARY_VALUE,
  CACHE_CONTROL_HEADER_NAME,
  NO_STORE_CACHE_CONTROL_VALUE,
  VARY_HEADER_NAME,
  VARY_HEADER_WILDCARD_VALUE,
  VARY_VALUES_JOIN_SEPARATOR,
  VARY_VALUE_SEPARATOR,
} from "@shared/infrastructure/http/constants/cache-control.constants";

import type { ServerResponse } from "node:http";
import type { FastifyReply } from "fastify";

/**
 * Merges a token into an existing `Vary` header value, case-insensitively and without duplicating it.
 *
 * An existing `*` stays authoritative and is returned as is, because a wildcard already nominates every request header.
 * Header values are compared through their string form, because Node and Fastify also store numeric header values.
 */
function mergeVaryHeaderValue(existingVaryHeader: string | number | string[] | undefined, varyValue: string): string {
  const existingValues = [existingVaryHeader ?? []]
    .flat()
    .flatMap(existingValue => String(existingValue).split(VARY_VALUE_SEPARATOR))
    .map(existingValue => existingValue.trim())
    .filter(existingValue => existingValue.length > 0);
  const hasVaryValue = existingValues.some(existingValue => existingValue.toLowerCase() === varyValue.toLowerCase());

  if (hasVaryValue || existingValues.includes(VARY_HEADER_WILDCARD_VALUE)) {
    return existingValues.join(VARY_VALUES_JOIN_SEPARATOR);
  }
  return [...existingValues, varyValue].join(VARY_VALUES_JOIN_SEPARATOR);
}

/**
 * Adds `Cache-Control: no-store` and the merged `Vary: Accept-Language` to a Fastify reply.
 */
function applyNoStoreResponseHeadersToFastifyReply(reply: FastifyReply): void {
  reply.header(CACHE_CONTROL_HEADER_NAME, NO_STORE_CACHE_CONTROL_VALUE);
  reply.header(VARY_HEADER_NAME, mergeVaryHeaderValue(reply.getHeader(VARY_HEADER_NAME), ACCEPT_LANGUAGE_VARY_VALUE));
}

/**
 * Adds the same headers to a raw Node response, used when a middleware error replies without a Fastify reply chain.
 */
function applyNoStoreResponseHeadersToServerResponse(response: ServerResponse): void {
  response.setHeader(CACHE_CONTROL_HEADER_NAME, NO_STORE_CACHE_CONTROL_VALUE);
  response.setHeader(VARY_HEADER_NAME, mergeVaryHeaderValue(response.getHeader(VARY_HEADER_NAME), ACCEPT_LANGUAGE_VARY_VALUE));
}

export {
  applyNoStoreResponseHeadersToFastifyReply,
  applyNoStoreResponseHeadersToServerResponse,
  mergeVaryHeaderValue,
};