import {
  ETAG_HEADER_NAME,
  LAST_MODIFIED_HEADER_NAME,
  PRESERVED_PUBLIC_ASSET_HTTP_STATUSES,
  PUBLIC_ASSETS_CACHE_CONTROL_VALUE,
} from "@src/infrastructure/api/server/cache/constants/cache.constants";

import { CACHE_CONTROL_HEADER_NAME } from "@shared/infrastructure/http/constants/cache-control.constants";
import { PUBLIC_ASSETS_PATH_PREFIX } from "@shared/infrastructure/http/constants/public-assets.constants";
import { applyNoStoreResponseHeadersToFastifyReply } from "@shared/infrastructure/helpers/response-headers/response-headers.helpers";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

function hasFileValidator(reply: FastifyReply): boolean {
  return reply.getHeader(ETAG_HEADER_NAME) !== undefined || reply.getHeader(LAST_MODIFIED_HEADER_NAME) !== undefined;
}

/**
 * Tells whether the response is a real `/public/` file served by the static plugin, whose revalidated cache headers must be preserved.
 *
 * A path prefix alone does not qualify: the response must be a successful or not-modified file response that still carries the
 * `@fastify/static` cache header and one of its validators, so a missing asset or a documentation asset is never exempted.
 */
function isPreservedPublicAssetResponse(request: FastifyRequest, reply: FastifyReply): boolean {
  const isPublicAssetPath = request.url.startsWith(PUBLIC_ASSETS_PATH_PREFIX);
  const hasPreservedStatus = PRESERVED_PUBLIC_ASSET_HTTP_STATUSES.includes(reply.statusCode);
  const hasPublicAssetsCacheControl = reply.getHeader(CACHE_CONTROL_HEADER_NAME) === PUBLIC_ASSETS_CACHE_CONTROL_VALUE;

  return isPublicAssetPath && hasPreservedStatus && hasPublicAssetsCacheControl && hasFileValidator(reply);
}

/**
 * Applies the response cache policy: every response is `no-store` and varies on `Accept-Language`, except a preserved public asset file.
 */
function applyResponseCachePolicyOnSend(request: FastifyRequest, reply: FastifyReply, payload: unknown, done: (error?: Error | null, payload?: unknown) => void): void {
  if (!isPreservedPublicAssetResponse(request, reply)) {
    applyNoStoreResponseHeadersToFastifyReply(reply);
  }
  done(undefined, payload);
}

/**
 * Registers the cache policy before the app is initialized, so Nest routes, Swagger and the static assets all inherit it.
 */
function setupResponseCachePolicy(app: NestFastifyApplication): void {
  app.getHttpAdapter().getInstance().addHook("onSend", applyResponseCachePolicyOnSend);
}

export {
  applyResponseCachePolicyOnSend,
  isPreservedPublicAssetResponse,
  setupResponseCachePolicy,
};