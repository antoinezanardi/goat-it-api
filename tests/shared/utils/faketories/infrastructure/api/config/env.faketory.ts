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
    ADMIN_API_KEY: faker.string.uuid(),
    GAME_API_KEY: faker.string.uuid(),
    ...appEnv,
  };
}

export { createFakeAppEnv };