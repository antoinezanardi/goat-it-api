import { connect as connectToMongoDatabase, connection, ConnectionStates, disconnect } from "mongoose";

async function connectToTestDatabase(): Promise<void> {
  if (connection.readyState === ConnectionStates.connected) {
    return;
  }
  await connectToMongoDatabase("mongodb://localhost:27017", {
    dbName: "goat-it-test",
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