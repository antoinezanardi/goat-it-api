import { faker } from "@faker-js/faker";

import type { AppMetadata } from "@app/types/app.types";

function createFakeApiMetadata(apiMetadata: Partial<AppMetadata> = {}): AppMetadata {
  return {
    version: faker.system.semver(),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    packageName: `${faker.lorem.word()}-${faker.lorem.word()}`,
    ...apiMetadata,
  };
}

export { createFakeApiMetadata };