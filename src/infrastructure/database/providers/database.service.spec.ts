import { EventEmitter } from "node:events";

import { Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { DatabaseService } from "@src/infrastructure/database/providers/database.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

import { createFakeMongoDatabaseConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { MongooseModuleOptions } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import type { Connection } from "mongoose";

describe("Database Service", () => {
  let services: { database: DatabaseService };
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService({
          mongoDbConfig: createFakeMongoDatabaseConfigFromEnv({
            host: "127.0.0.1",
            port: 27_018,
            database: "goat-it-test",
          }),
        }),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
      ],
    }).compile();

    services = { database: module.get<DatabaseService>(DatabaseService) };
  });

  describe("Constructor", () => {
    it("should log database connection message when instantiated.", () => {
      expect(Logger).toHaveBeenCalledExactlyOnceWith(DatabaseService.name);
    });
  });

  describe("createMongooseOptions", () => {
    it("should log database connecting message when called.", () => {
      services.database.createMongooseOptions();
      const mockedLoggerInstance = getMockedLoggerInstance();

      expect(mockedLoggerInstance.log).toHaveBeenCalledExactlyOnceWith("🍃 Connecting to the database...");
    });

    it("should return mongoose options when called.", () => {
      const options = services.database.createMongooseOptions();
      const expectedOptions: MongooseModuleOptions = {
        uri: "mongodb://127.0.0.1:27018",
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        retryDelay: 3000,
        retryAttempts: 5,
        dbName: "goat-it-test",
        onConnectionCreate: expect.any(Function) as (connection: Connection) => Connection,
      };

      expect(options).toStrictEqual<MongooseModuleOptions>(expectedOptions);
    });

    it("should return the connection from onConnectionCreate option when called.", () => {
      const options = services.database.createMongooseOptions();
      const mockedConnection = new EventEmitter() as unknown as Connection;
      const connection = (options.onConnectionCreate as (connection: object) => Connection)(mockedConnection);

      expect(connection).toStrictEqual<Connection>(mockedConnection);
    });
  });

  describe("onMongooseConnectionCreate", () => {
    it("should log database connected message when connection emits connected event.", () => {
      const fakeConnection = new EventEmitter() as unknown as Connection;
      services.database["onMongooseConnectionCreate"](fakeConnection);
      fakeConnection.emit("connected");
      const mockedLoggerInstance = getMockedLoggerInstance();

      expect(mockedLoggerInstance.log).toHaveBeenCalledExactlyOnceWith("🍀 Database connection established");
    });

    it("should log database disconnected message when connection emits disconnected event.", () => {
      const fakeConnection = new EventEmitter() as unknown as Connection;
      services.database["onMongooseConnectionCreate"](fakeConnection);
      fakeConnection.emit("disconnected");
      const mockedLoggerInstance = getMockedLoggerInstance();

      expect(mockedLoggerInstance.warn).toHaveBeenCalledExactlyOnceWith("⚠️ Database connection lost");
    });

    it("should return the connection when called.", () => {
      const fakeConnection = new EventEmitter() as unknown as Connection;
      const connection = services.database["onMongooseConnectionCreate"](fakeConnection);

      expect(connection).toStrictEqual<Connection>(fakeConnection);
    });
  });
});