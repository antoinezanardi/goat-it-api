import { faker } from "@faker-js/faker";

import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

function createFakeCorsConfig(corsConfig: Partial<CorsConfig> = {}): CorsConfig {
  return {
    origin: faker.internet.url(),
    credentials: faker.datatype.boolean(),
    methods: faker.helpers.arrayElements(["GET", "POST", "DELETE", "PATCH", "OPTIONS"]),
    allowedHeaders: faker.helpers.arrayElements(["Content-Type", "Authorization", "X-Custom-Header"]),
    exposedHeaders: faker.helpers.arrayElements(["X-Request-Id", "X-Custom-Header"]),
    ...corsConfig,
  };
}

export { createFakeCorsConfig };