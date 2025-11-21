import { faker } from "@faker-js/faker";

import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

function createFakeCorsConfig(corsConfig: Partial<CorsConfig> = {}): CorsConfig {
  return {
    origin: faker.internet.url(),
    credentials: faker.datatype.boolean(),
    methods: faker.helpers.arrayElements(["GET", "POST", "PUT", "DELETE"]),
    allowedHeaders: faker.helpers.arrayElements(["Content-Type", "Authorization", "X-Custom-Header"]),
    ...corsConfig,
  };
}

export { createFakeCorsConfig };