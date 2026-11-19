import type { Mock } from "vitest";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

type MockedFastifyInstance = {
  addHook: Mock<(name: string, hook: unknown) => void>;
};

type MockedFastifyReply = {
  header: Mock<(name: string, value: string) => void>;
  raw: {
    setHeader: Mock<(name: string, value: string) => void>;
  };
};

type MockedFastifyRequest = {
  id: string;
};

function createMockedFastifyInstance(overrides: Partial<MockedFastifyInstance> = {}): FastifyInstance {
  const fastifyInstance = {
    addHook: vi.fn<(name: string, hook: unknown) => void>(),
    ...overrides,
  };

  // Acceptable as the factory exposes only the Fastify members the system under test reads.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return fastifyInstance as unknown as FastifyInstance;
}

function createMockedFastifyReply(overrides: Partial<MockedFastifyReply> = {}): FastifyReply {
  const fastifyReply = {
    header: vi.fn<(name: string, value: string) => void>(),
    raw: {
      setHeader: vi.fn<(name: string, value: string) => void>(),
    },
    ...overrides,
  };

  // Acceptable as the factory exposes only the Fastify members the system under test reads.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return fastifyReply as unknown as FastifyReply;
}

function createMockedFastifyRequest(overrides: Partial<MockedFastifyRequest> = {}): FastifyRequest {
  const fastifyRequest = {
    id: "request-id",
    ...overrides,
  };

  // Acceptable as the factory exposes only the Fastify members the system under test reads.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return fastifyRequest as unknown as FastifyRequest;
}

export {
  createMockedFastifyInstance,
  createMockedFastifyReply,
  createMockedFastifyRequest,
};