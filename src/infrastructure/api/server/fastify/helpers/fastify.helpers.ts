import { FastifyAdapter } from "@nestjs/platform-fastify";

import {
  FASTIFY_BODY_LIMIT_BYTES,
  FASTIFY_HANDLER_TIMEOUT_MS,
  IS_FASTIFY_INBOUND_REQUEST_ID_HEADER_ENABLED,
  FASTIFY_REQUEST_TIMEOUT_MS,
  NODE_CONNECTIONS_CHECKING_INTERVAL_MS,
  NODE_HEADERS_TIMEOUT_MS,
} from "@src/infrastructure/api/server/fastify/constants/fastify.constants";
import { createRequestId } from "@src/infrastructure/api/server/request-id/helpers/request-id.helpers";

import type { FastifyTrustProxy } from "@src/infrastructure/api/server/fastify/types/fastify.types";

/**
 * Builds the Fastify adapter with the app HTTP bounds: a 512 KiB body limit, a 30-second request-receive deadline checked every 5 seconds, a 15-second handler timeout and JSON-only body parsing for body-bearing write routes.
 *
 * The adapter trusts only the configured proxy peer when resolving the client address and generates its own UUID request identifier, so an inbound request ID header is never used.
 *
 * `requestTimeout` stays a top-level Fastify option because Fastify assigns it to the Node server itself; `headersTimeout`
 * and `connectionsCheckingInterval` only exist as nested `http` server options, which the adapter forwards to `http.createServer`.
 */
function createFastifyAdapter(trustProxy: FastifyTrustProxy): FastifyAdapter {
  const adapter = new FastifyAdapter({
    bodyLimit: FASTIFY_BODY_LIMIT_BYTES,
    requestTimeout: FASTIFY_REQUEST_TIMEOUT_MS,
    handlerTimeout: FASTIFY_HANDLER_TIMEOUT_MS,
    trustProxy,
    requestIdHeader: IS_FASTIFY_INBOUND_REQUEST_ID_HEADER_ENABLED,
    genReqId: createRequestId,
    http: {
      headersTimeout: NODE_HEADERS_TIMEOUT_MS,
      connectionsCheckingInterval: NODE_CONNECTIONS_CHECKING_INTERVAL_MS,
    },
  });
  adapter.getInstance().removeContentTypeParser("text/plain");

  return adapter;
}

export { createFastifyAdapter };