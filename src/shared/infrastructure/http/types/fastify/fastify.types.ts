import type { FastifyRequest } from "fastify";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

/**
 * Raw Fastify request carrying the localization options resolved from the `Accept-Language` header.
 */
type AugmentedFastifyRequestRaw = FastifyRequest["raw"] & FastifyRequestRawLocalizationOptions;

/**
 * Fastify request whose `raw` object exposes the localization options attached by `LocalizationMiddleware`.
 */
type AugmentedFastifyRequest = FastifyRequest & {
  raw: AugmentedFastifyRequestRaw;
};

type FastifyRequestRawLocalizationOptions = {
  /**
   * Set by `LocalizationMiddleware` before the handler runs; it stays `undefined` on a route that does not apply that middleware.
   */
  localizationOptions?: LocalizationOptions;
};

export type {
  AugmentedFastifyRequest,
  AugmentedFastifyRequestRaw,
  FastifyRequestRawLocalizationOptions,
};