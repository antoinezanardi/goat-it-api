import { faker } from "@faker-js/faker";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

function createFakeAppEnv(appEnv: Partial<AppEnv> = {}): AppEnv {
  return {
    HOST: faker.internet.ipv4(),
    PORT: faker.number.int({ min: 1024, max: 65_535 }),
    CORS_ORIGIN: faker.internet.url(),
    ...appEnv,
  };
}

export { createFakeAppEnv };