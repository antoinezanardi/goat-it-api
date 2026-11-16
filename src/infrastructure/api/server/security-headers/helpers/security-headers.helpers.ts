import {
  OPTIONS_HTTP_METHOD,
  OPTIONS_RESPONSE_SECURITY_HEADERS,
  PERMISSIONS_POLICY_HEADER_NAME,
  PERMISSIONS_POLICY_HEADER_VALUE,
  RESPONSE_HEADER_NAMES_TO_REMOVE,
  SECURITY_HEADERS_OPTIONS,
} from "@src/infrastructure/api/server/security-headers/constants/security-headers.constants";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

function applyMissingSecurityHeadersToReply(reply: FastifyReply): void {
  for (const [headerName, headerValue] of OPTIONS_RESPONSE_SECURITY_HEADERS) {
    if (reply.getHeader(headerName) === undefined) {
      reply.header(headerName, headerValue);
    }
  }
  for (const headerName of RESPONSE_HEADER_NAMES_TO_REMOVE) {
    if (reply.getHeader(headerName) !== undefined) {
      reply.removeHeader(headerName);
    }
  }
}

/**
 * Writes the `Permissions-Policy` header on the raw Node response.
 *
 * Runs before middie because it is registered before `NestFactory.create()`, so it also covers a middleware error answered through a synthetic Fastify reply.
 */
function setPermissionsPolicyHeaderOnRequest(_request: FastifyRequest, reply: FastifyReply, done: () => void): void {
  reply.raw.setHeader(PERMISSIONS_POLICY_HEADER_NAME, PERMISSIONS_POLICY_HEADER_VALUE);
  done();
}

/**
 * Fills the security headers missing on a CORS preflight reply, because `@fastify/cors` answers `OPTIONS` before the request-phase hooks run.
 *
 * An existing value wins, `Access-Control-*` headers are never written, and the status, the content length and the payload are left untouched.
 */
function applyOptionsSecurityHeadersOnSend(request: FastifyRequest, reply: FastifyReply, payload: unknown, done: (error?: Error | null, payload?: unknown) => void): void {
  if (request.method === OPTIONS_HTTP_METHOD) {
    applyMissingSecurityHeadersToReply(reply);
  }
  done(undefined, payload);
}

/**
 * Registers the root `Permissions-Policy` request hook on the Fastify instance.
 *
 * Must run before `NestFactory.create()`, because the NestJS boot registers middie's `onRequest` hook inside the
 * app creation: a hook added afterwards never runs on a request rejected by a middleware.
 */
function setupSecurityHeadersRequestHook(fastifyInstance: FastifyInstance): void {
  fastifyInstance.addHook("onRequest", setPermissionsPolicyHeaderOnRequest);
}

/**
 * Enables the NestJS security headers once and registers the `OPTIONS` fallback that covers what the native options cannot express.
 *
 * Must run before the app is initialized, so controllers, Swagger and the static assets inherit the hook.
 */
function setupSecurityHeaders(app: NestFastifyApplication): void {
  app.useSecurityHeaders(SECURITY_HEADERS_OPTIONS);
  app.getHttpAdapter().getInstance().addHook("onSend", applyOptionsSecurityHeadersOnSend);
}

export {
  applyOptionsSecurityHeadersOnSend,
  setPermissionsPolicyHeaderOnRequest,
  setupSecurityHeaders,
  setupSecurityHeadersRequestHook,
};