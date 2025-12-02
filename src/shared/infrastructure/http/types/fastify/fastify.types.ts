import type { FastifyRequest } from "fastify";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

type AugmentedFastifyRequestRaw = FastifyRequest["raw"] & FastifyRequestRawLocalizationOptions;

type AugmentedFastifyRequest = FastifyRequest & {
  raw: AugmentedFastifyRequestRaw;
};

type FastifyRequestRawLocalizationOptions = {
  localizationOptions?: LocalizationOptions;
};

export type {
  AugmentedFastifyRequest,
  AugmentedFastifyRequestRaw,
  FastifyRequestRawLocalizationOptions,
};