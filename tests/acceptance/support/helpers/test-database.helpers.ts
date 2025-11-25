import { connect as connectToMongoDatabase, connection } from "mongoose";

async function connectToTestDatabase(): Promise<void> {
  await connectToMongoDatabase("mongodb://localhost:27017/goat-it-test");
}

async function resetTestDatabase(): Promise<void> {
  const collections = await connection.db?.collections();
  if (!collections) {
    return;
  }

  await Promise.all(collections.map(async collection => collection.drop()));
}

export {
  connectToTestDatabase,
  resetTestDatabase,
};