import type { Connection } from "mongoose";
import type { Mock } from "vitest";

type MongooseConnectionStub = {
  on: (event: string, listener: () => void) => Connection;
  close: (isForced?: boolean) => Promise<void>;
};

type MockedMongooseConnection = { [K in keyof MongooseConnectionStub]: Mock<MongooseConnectionStub[K]> };

function createMockedMongooseConnection(overrides: Partial<MockedMongooseConnection> = {}): MockedMongooseConnection {
  return {
    on: vi.fn<MongooseConnectionStub["on"]>(),
    close: vi.fn<MongooseConnectionStub["close"]>(),
    ...overrides,
  };
}

export { createMockedMongooseConnection };

export type { MockedMongooseConnection };