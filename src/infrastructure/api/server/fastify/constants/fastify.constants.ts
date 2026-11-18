const FASTIFY_BODY_LIMIT_BYTES = 524_288;

const FASTIFY_REQUEST_TIMEOUT_MS = 30_000;

const FASTIFY_HANDLER_TIMEOUT_MS = 15_000;

const NODE_HEADERS_TIMEOUT_MS = 30_000;

const NODE_CONNECTIONS_CHECKING_INTERVAL_MS = 5000;

// Acceptable as exported constants must be UPPER_CASE while the boolean-prefix rule wants PascalCase after the "IS" prefix and this option must stay disabled by default.
// eslint-disable-next-line @typescript-eslint/naming-convention
const IS_FASTIFY_INBOUND_REQUEST_ID_HEADER_ENABLED = false;

export {
  FASTIFY_BODY_LIMIT_BYTES,
  FASTIFY_REQUEST_TIMEOUT_MS,
  FASTIFY_HANDLER_TIMEOUT_MS,
  NODE_HEADERS_TIMEOUT_MS,
  NODE_CONNECTIONS_CHECKING_INTERVAL_MS,
  IS_FASTIFY_INBOUND_REQUEST_ID_HEADER_ENABLED,
};