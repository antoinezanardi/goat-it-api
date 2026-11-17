import { faker } from "@faker-js/faker";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

function createFakeAppEnv(appEnv: Partial<AppEnv> = {}): AppEnv {
  return {
    SERVER_HOST: faker.internet.ipv4(),
    SERVER_PORT: faker.number.int({ min: 1024, max: 65_535 }),
    CORS_ORIGIN: faker.internet.url(),
    MONGODB_HOST: faker.internet.ipv4(),
    MONGODB_PORT: faker.number.int({ min: 1024, max: 65_535 }),
    MONGODB_DATABASE: faker.lorem.word(),
    FALLBACK_LOCALE: faker.helpers.arrayElement(LOCALES),
    THROTTLER_DEFAULT_TTL_SECONDS: faker.number.int({ min: 1, max: 60 }),
    THROTTLER_DEFAULT_LIMIT: faker.number.int({ min: 1, max: 1000 }),
    THROTTLER_SUSTAINED_TTL_SECONDS: faker.number.int({ min: 1, max: 60 }),
    THROTTLER_SUSTAINED_LIMIT: faker.number.int({ min: 1, max: 100_000 }),
    API_KEY_HMAC_SECRET: faker.string.alpha({ length: 32 }),
    ADMIN_API_KEY: faker.string.uuid(),
    GAME_API_KEY: faker.string.uuid(),
    ...appEnv,
  };
}

export { createFakeAppEnv };