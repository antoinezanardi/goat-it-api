import { applyNoStoreResponseHeadersToFastifyReply, applyNoStoreResponseHeadersToServerResponse, mergeVaryHeaderValue } from "@shared/infrastructure/helpers/response-headers/response-headers.helpers";

import type { ServerResponse } from "node:http";
import type { FastifyReply } from "fastify";

describe(mergeVaryHeaderValue, () => {
  it.each<{
    test: string;
    existingVaryHeader: string | number | string[] | undefined;
    expected: string;
  }>([
    {
      test: "should return the vary value when the header is absent.",
      existingVaryHeader: undefined,
      expected: "Accept-Language",
    },
    {
      test: "should return the vary value when the header is an empty string.",
      existingVaryHeader: "",
      expected: "Accept-Language",
    },
    {
      test: "should append the vary value when another token is present.",
      existingVaryHeader: "Origin",
      expected: "Origin, Accept-Language",
    },
    {
      test: "should not duplicate the vary value when the token is already present.",
      existingVaryHeader: "Accept-Language",
      expected: "Accept-Language",
    },
    {
      test: "should not duplicate the vary value when the token is present with another case.",
      existingVaryHeader: "accept-language",
      expected: "accept-language",
    },
    {
      test: "should not duplicate the vary value when the token is present among other tokens.",
      existingVaryHeader: "Origin, Accept-Language",
      expected: "Origin, Accept-Language",
    },
    {
      test: "should keep a wildcard authoritative when it is present.",
      existingVaryHeader: "*",
      expected: "*",
    },
    {
      test: "should merge a comma separated header value and trim its tokens.",
      existingVaryHeader: "Origin, Accept-Encoding",
      expected: "Origin, Accept-Encoding, Accept-Language",
    },
    {
      test: "should merge an array header value.",
      existingVaryHeader: ["Origin", "Accept-Encoding"],
      expected: "Origin, Accept-Encoding, Accept-Language",
    },
    {
      test: "should merge a numeric header value.",
      existingVaryHeader: 7,
      expected: "7, Accept-Language",
    },
  ])("$test", ({ existingVaryHeader, expected }) => {
    expect(mergeVaryHeaderValue(existingVaryHeader, "Accept-Language")).toBe(expected);
  });
});

describe(applyNoStoreResponseHeadersToFastifyReply, () => {
  let mocks: {
    replies: {
      fastifyReply: FastifyReply;
    };
  };

  beforeEach(() => {
    mocks = {
      replies: {
        fastifyReply: {
          getHeader: vi.fn<(name: string) => string | undefined>().mockReturnValue(undefined),
          header: vi.fn<(name: string, value: string) => void>(),
        } as unknown as FastifyReply,
      },
    };
  });

  it("should set the no-store cache control header when called.", () => {
    applyNoStoreResponseHeadersToFastifyReply(mocks.replies.fastifyReply);

    expect(mocks.replies.fastifyReply.header).toHaveBeenCalledWith("Cache-Control", "no-store");
  });

  it("should set the accept language vary header when no vary header is present.", () => {
    applyNoStoreResponseHeadersToFastifyReply(mocks.replies.fastifyReply);

    expect(mocks.replies.fastifyReply.header).toHaveBeenCalledWith("Vary", "Accept-Language");
  });

  it("should merge an existing vary header when called.", () => {
    vi.mocked(mocks.replies.fastifyReply.getHeader).mockReturnValue("Origin");

    applyNoStoreResponseHeadersToFastifyReply(mocks.replies.fastifyReply);

    expect(mocks.replies.fastifyReply.header).toHaveBeenCalledWith("Vary", "Origin, Accept-Language");
  });

  it("should read the vary header of the reply when called.", () => {
    applyNoStoreResponseHeadersToFastifyReply(mocks.replies.fastifyReply);

    expect(mocks.replies.fastifyReply.getHeader).toHaveBeenCalledExactlyOnceWith("Vary");
  });
});

describe(applyNoStoreResponseHeadersToServerResponse, () => {
  let mocks: {
    responses: {
      serverResponse: ServerResponse;
    };
  };

  beforeEach(() => {
    mocks = {
      responses: {
        serverResponse: {
          getHeader: vi.fn<(name: string) => string | undefined>().mockReturnValue(undefined),
          setHeader: vi.fn<(name: string, value: string) => void>(),
        } as unknown as ServerResponse,
      },
    };
  });

  it("should set the no-store cache control header when called.", () => {
    applyNoStoreResponseHeadersToServerResponse(mocks.responses.serverResponse);

    expect(mocks.responses.serverResponse.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
  });

  it("should merge an existing vary header when called.", () => {
    vi.mocked(mocks.responses.serverResponse.getHeader).mockReturnValue("Origin");

    applyNoStoreResponseHeadersToServerResponse(mocks.responses.serverResponse);

    expect(mocks.responses.serverResponse.setHeader).toHaveBeenCalledWith("Vary", "Origin, Accept-Language");
  });

  it("should set the accept language vary header when no vary header is present.", () => {
    applyNoStoreResponseHeadersToServerResponse(mocks.responses.serverResponse);

    expect(mocks.responses.serverResponse.setHeader).toHaveBeenCalledWith("Vary", "Accept-Language");
  });
});