import type { FastifyRequest } from "fastify";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

type AugmentedFastifyRequest = FastifyRequest & {
  raw: AugmentedFastifyRequestRaw;
};

type AugmentedFastifyRequestRaw = FastifyRequest & FastifyRequestRawLocalizationOptions;

type FastifyRequestRawLocalizationOptions = {
  localizationOptions: LocalizationOptions;
};

export type {
  AugmentedFastifyRequest,
  AugmentedFastifyRequestRaw,
  FastifyRequestRawLocalizationOptions,
};