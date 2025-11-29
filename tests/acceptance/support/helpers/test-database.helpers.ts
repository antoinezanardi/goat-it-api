import { connect as connectToMongoDatabase, connection, ConnectionStates, disconnect } from "mongoose";

async function connectToTestDatabase(): Promise<void> {
  if (connection.readyState === ConnectionStates.connected) {
    return;
  }
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