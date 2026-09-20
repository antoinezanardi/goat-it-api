import mongoose from "mongoose";

function validateEnvRequirements(): void {
  const requiredEnvVariables = [
    "MONGODB_HOST",
    "MONGODB_PORT",
    "MONGODB_DATABASE",
  ];

  const missingEnvVariables = requiredEnvVariables.filter(name => {
    const value = process.env[name];

    return value === undefined || value.trim() === "";
  });

  if (missingEnvVariables.length > 0) {
    throw new Error(`Missing required environment variable(s) for database tests: ${missingEnvVariables.join(", ")}. ` +
      "Please set these in your test environment (`env/.env.test`) before running acceptance tests.");
  }
}

async function connectToTestDatabase(): Promise<void> {
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    return;
  }

  validateEnvRequirements();

  const mongoUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DATABASE,
  });
}

async function resetTestDatabase(): Promise<void> {
  const collections = await mongoose.connection.db?.collections();
  if (!collections) {
    return;
  }
  await Promise.all(collections.map(async collection => collection.drop()));
}

async function closeTestDatabaseConnection(): Promise<void> {
  return mongoose.disconnect();
}

export {
  connectToTestDatabase,
  resetTestDatabase,
  closeTestDatabaseConnection,
};