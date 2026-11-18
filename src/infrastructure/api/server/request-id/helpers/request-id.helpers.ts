import { randomUUID } from "node:crypto";

import { REQUEST_ID_RESPONSE_HEADER_NAME } from "@src/infrastructure/api/server/request-id/constants/request-id.constants";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

/**
 * Generates the per-request identifier from the OS entropy source as a UUID v4, never from client input.
 */
function createRequestId(): string {
  return randomUUID();
}

/**
 * Writes the request identifier on the reply as early as the request phase, before NestJS middleware runs.
 */
function setRequestIdHeaderOnRequest(request: FastifyRequest, reply: FastifyReply, done: () => void): void {
  reply.header(REQUEST_ID_RESPONSE_HEADER_NAME, request.id);
  done();
}

/**
 * Re-writes the same request identifier on the reply for every application-managed response, including CORS preflight and error replies.
 */
function setRequestIdHeaderOnSend(request: FastifyRequest, reply: FastifyReply, payload: unknown, done: (error?: Error | null, payload?: unknown) => void): void {
  reply.header(REQUEST_ID_RESPONSE_HEADER_NAME, request.id);
  done(undefined, payload);
}

/**
 * Registers both request-identifier hooks on the root Fastify instance.
 *
 * Must run before `NestFactory.create()`: a request hook added afterwards runs after middie and never runs on a middleware-rejected request.
 */
function setupRequestIdHooks(fastifyInstance: FastifyInstance): void {
  fastifyInstance.addHook("onRequest", setRequestIdHeaderOnRequest);
  fastifyInstance.addHook("onSend", setRequestIdHeaderOnSend);
}

export {
  createRequestId,
  setRequestIdHeaderOnRequest,
  setRequestIdHeaderOnSend,
  setupRequestIdHooks,
};