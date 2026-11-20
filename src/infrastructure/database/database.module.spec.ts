import { Reflector } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";

import { DatabaseModule } from "@src/infrastructure/database/database.module";
import { DatabaseService } from "@src/infrastructure/database/providers/database.service";

describe(DatabaseModule, () => {
  it("should import the logger module when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("imports", DatabaseModule)).toContainEqual(LoggerModule);
  });

  it("should create the mongoose connection from the database service when the module metadata is read.", () => {
    type MongooseCoreModuleMetadata = {
      providers: { useClass?: unknown }[];
    };

    type MongooseModuleMetadata = {
      imports: MongooseCoreModuleMetadata[];
    };

    const reflector = new Reflector();
    const [, mongooseModule] = reflector.get<[unknown, MongooseModuleMetadata]>("imports", DatabaseModule);
    const [mongooseCoreModule] = mongooseModule.imports;

    expect(mongooseCoreModule.providers).toContainEqual(expect.objectContaining({ useClass: DatabaseService }));
  });
});