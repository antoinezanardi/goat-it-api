import { faker } from "@faker-js/faker";

import type { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";

function createFakeAppMetadata(appMetadata: Partial<AppMetadataDto> = {}): AppMetadataDto {
  return {
    version: faker.system.semver(),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    packageName: `${faker.lorem.word()}-${faker.lorem.word()}`,
    ...appMetadata,
  };
}

export { createFakeAppMetadata };