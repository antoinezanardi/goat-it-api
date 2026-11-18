import { FastifyAdapter } from "@nestjs/platform-fastify";

import { REQUEST_ID_RESPONSE_HEADER_NAME, REQUEST_ID_UUID_V4_PATTERN } from "@src/infrastructure/api/server/request-id/constants/request-id.constants";
import { createRequestId, setRequestIdHeaderOnRequest, setRequestIdHeaderOnSend, setupRequestIdHooks } from "@src/infrastructure/api/server/request-id/helpers/request-id.helpers";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const REQUEST_ID_FIXTURE = "3f2b7c1e-4d5a-4e6f-8a9b-0c1d2e3f4a5b";

function createRequestIdFastifyInstance(): FastifyInstance {
  const adapter = new FastifyAdapter({ genReqId: createRequestId });

  return adapter.getInstance();
}

describe(createRequestId, () => {
  it("should return a UUID v4 value when called.", () => {
    expect(createRequestId()).toMatch(REQUEST_ID_UUID_V4_PATTERN);
  });

  it("should return a new value on every call when called twice.", () => {
    expect(createRequestId()).not.toStrictEqual(createRequestId());
  });
});

describe(setupRequestIdHooks, () => {
  let mocks: {
    fastifyInstance: FastifyInstance;
  };

  beforeEach(() => {
    mocks = {
      fastifyInstance: {
        addHook: vi.fn<(name: string, hook: unknown) => void>(),
      } as unknown as FastifyInstance,
    };
  });

  it("should register the request identifier request hook when called.", () => {
    setupRequestIdHooks(mocks.fastifyInstance);

    expect(mocks.fastifyInstance.addHook).toHaveBeenNthCalledWith(1, "onRequest", setRequestIdHeaderOnRequest);
  });

  it("should register the request identifier response hook when called.", () => {
    setupRequestIdHooks(mocks.fastifyInstance);

    expect(mocks.fastifyInstance.addHook).toHaveBeenNthCalledWith(2, "onSend", setRequestIdHeaderOnSend);
  });

  it("should expose a UUID request identifier header on a successful reply when called.", async() => {
    const fastifyInstance = createRequestIdFastifyInstance();
    fastifyInstance.get("/", () => ({ status: "ok" }));
    setupRequestIdHooks(fastifyInstance);

    const response = await fastifyInstance.inject({ method: "GET", url: "/" });

    expect(response.headers[REQUEST_ID_RESPONSE_HEADER_NAME.toLowerCase()]).toMatch(REQUEST_ID_UUID_V4_PATTERN);
  });

  it("should expose a UUID request identifier header on a not found reply when called.", async() => {
    const fastifyInstance = createRequestIdFastifyInstance();
    setupRequestIdHooks(fastifyInstance);

    const response = await fastifyInstance.inject({ method: "GET", url: "/unknown-route" });

    expect(response.headers[REQUEST_ID_RESPONSE_HEADER_NAME.toLowerCase()]).toMatch(REQUEST_ID_UUID_V4_PATTERN);
  });
});

describe(setRequestIdHeaderOnRequest, () => {
  let mocks: {
    request: FastifyRequest;
    reply: FastifyReply;
    done: () => void;
  };

  beforeEach(() => {
    mocks = {
      request: { id: REQUEST_ID_FIXTURE } as FastifyRequest,
      reply: { header: vi.fn<(name: string, value: string) => void>() } as unknown as FastifyReply,
      done: vi.fn<() => void>(),
    };
  });

  it("should write the request id header with the request identifier when called.", () => {
    setRequestIdHeaderOnRequest(mocks.request, mocks.reply, mocks.done);

    expect(mocks.reply.header).toHaveBeenCalledExactlyOnceWith(REQUEST_ID_RESPONSE_HEADER_NAME, REQUEST_ID_FIXTURE);
  });

  it("should continue the request when called.", () => {
    setRequestIdHeaderOnRequest(mocks.request, mocks.reply, mocks.done);

    expect(mocks.done).toHaveBeenCalledExactlyOnceWith();
  });
});

describe(setRequestIdHeaderOnSend, () => {
  let mocks: {
    request: FastifyRequest;
    reply: FastifyReply;
    done: (error?: Error | null, payload?: unknown) => void;
  };

  beforeEach(() => {
    mocks = {
      request: { id: REQUEST_ID_FIXTURE } as FastifyRequest,
      reply: { header: vi.fn<(name: string, value: string) => void>() } as unknown as FastifyReply,
      done: vi.fn<(error?: Error | null, payload?: unknown) => void>(),
    };
  });

  it("should write the request id header with the request identifier when called.", () => {
    setRequestIdHeaderOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).toHaveBeenCalledExactlyOnceWith(REQUEST_ID_RESPONSE_HEADER_NAME, REQUEST_ID_FIXTURE);
  });

  it("should pass the payload through unchanged when called.", () => {
    const payload = { statusCode: 404 };

    setRequestIdHeaderOnSend(mocks.request, mocks.reply, payload, mocks.done);

    expect(mocks.done).toHaveBeenCalledExactlyOnceWith(undefined, payload);
  });
});