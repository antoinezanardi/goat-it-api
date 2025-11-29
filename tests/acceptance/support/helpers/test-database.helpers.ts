import { connect as connectToMongoDatabase, connection, ConnectionStates, disconnect } from "mongoose";

function validateEnvRequirements(): void {
  const requiredEnvVariables = [
    "MONGODB_HOST",
    "MONGODB_PORT",
    "MONGODB_DATABASE",
  ];

  const missingEnvVariables = requiredEnvVariables.filter(name => process.env[name] === undefined);

  if (missingEnvVariables.length > 0) {
    throw new Error(`Missing required environment variable(s) for database tests: ${missingEnvVariables.join(", ")}. ` +
      "Please set these in your test environment (e.g., env/.env.test) before running acceptance tests.");
  }
}

async function connectToTestDatabase(): Promise<void> {
  if (connection.readyState === ConnectionStates.connected) {
    return;
  }

  validateEnvRequirements();

  const mongoUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
  await connectToMongoDatabase(mongoUri, {
    dbName: process.env.MONGODB_DATABASE,
  });
}

async function resetTestDatabase(): Promise<void> {
  const collections = await connection.db?.collections();
  if (!collections) {
    return;
  }
  await Promise.all(collections.map(async collection => collection.drop()));
}

async function closeTestDatabaseConnection(): Promise<void> {
  return disconnect();
}

export {
  connectToTestDatabase,
  resetTestDatabase,
  closeTestDatabaseConnection,
};