import { faker } from "@faker-js/faker";

import type { APIMetadata } from "@app/types/app.types";

function createFakeApiMetadata(apiMetadata: Partial<APIMetadata> = {}): APIMetadata {
  return {
    version: faker.system.semver(),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    packageName: faker.system.fileName(),
    ...apiMetadata,
  };
}

export { createFakeApiMetadata };