import { Logger, Injectable } from "@nestjs/common";

import { DATABASE_CONNECTION_TIMEOUT_MS, DATABASE_NAME, DATABASE_RETRY_ATTEMPTS, DATABASE_RETRY_DELAY_MS } from "@modules/database/constants/database.constants";

import type { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import type { Connection } from "mongoose";

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  private readonly logger = new Logger(DatabaseService.name);

  public createMongooseOptions(): MongooseModuleOptions {
    this.logger.log("🍃 Connecting to the database...");

    return {
      uri: "mongodb://localhost:27017",
      serverSelectionTimeoutMS: DATABASE_CONNECTION_TIMEOUT_MS,
      connectTimeoutMS: DATABASE_CONNECTION_TIMEOUT_MS,
      retryDelay: DATABASE_RETRY_DELAY_MS,
      retryAttempts: DATABASE_RETRY_ATTEMPTS,
      dbName: DATABASE_NAME,
      onConnectionCreate: connection => this.onMongooseConnectionCreate(connection),
    };
  }

  private onMongooseConnectionCreate(connection: Connection): Connection {
    connection.on("connected", () => {
      this.logger.log("🍀 Database connection established");
    });

    connection.on("disconnected", () => {
      this.logger.warn("⚠️ Database connection lost");
    });

    return connection;
  }
}