const REQUEST_ID_RESPONSE_HEADER_NAME = "X-Request-Id";

const REQUEST_ID_UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

export {
  REQUEST_ID_RESPONSE_HEADER_NAME,
  REQUEST_ID_UUID_V4_PATTERN,
};