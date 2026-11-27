import { getConnectionToken } from "@nestjs/mongoose";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import { DatabaseModule } from "@src/infrastructure/database/database.module";
import { DatabaseService } from "@src/infrastructure/database/providers/database.service";

import { AppConfigTestingModule } from "@unit-tests/utils/helpers/nest/app-config-testing.module";

import { createMockedMongooseConnection } from "@mocks/infrastructure/database/mongoose-connection.mock";

import type { TestingModule } from "@nestjs/testing";

describe(DatabaseModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [AppConfigTestingModule, DatabaseModule] })
      .overrideProvider(getConnectionToken())
      .useValue(createMockedMongooseConnection())
      .compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it("should not import the logger module when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("imports", DatabaseModule)).not.toContainEqual(LoggerModule);
  });

  it("should import exactly one module when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("imports", DatabaseModule)).toHaveLength(1);
  });

  it("should create the mongoose connection from the database service when the module metadata is read.", () => {
    type MongooseCoreModuleMetadata = {
      providers: { useClass?: unknown }[];
    };

    type MongooseModuleMetadata = {
      imports: MongooseCoreModuleMetadata[];
    };

    const reflector = new Reflector();
    const [mongooseModule] = reflector.get<[MongooseModuleMetadata]>("imports", DatabaseModule);
    const [mongooseCoreModule] = mongooseModule.imports;

    expect(mongooseCoreModule.providers).toContainEqual(expect.objectContaining({ useClass: DatabaseService }));
  });

  it("should resolve the database service when the module graph is compiled.", () => {
    expect(module.get(DatabaseService)).toBeInstanceOf(DatabaseService);
  });
});