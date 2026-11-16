import { FastifyAdapter } from "@nestjs/platform-fastify";

import { createFastifyAdapter } from "@src/infrastructure/api/server/fastify/helpers/fastify.helpers";

describe(createFastifyAdapter, () => {
  it("should return a Fastify adapter when called.", () => {
    expect(createFastifyAdapter()).toBeInstanceOf(FastifyAdapter);
  });

  it("should set the body limit to 512 KiB when called.", () => {
    expect(createFastifyAdapter().getInstance().initialConfig.bodyLimit).toBe(524_288);
  });

  it("should set the Node request timeout to 30 seconds when called.", () => {
    expect(createFastifyAdapter().getHttpServer().requestTimeout).toBe(30_000);
  });

  it("should set the Node headers timeout to 30 seconds when called.", () => {
    expect(createFastifyAdapter().getHttpServer().headersTimeout).toBe(30_000);
  });

  it("should set the Node connections checking interval to 5 seconds when called.", () => {
    expect(createFastifyAdapter().getHttpServer()).toMatchObject({ connectionsCheckingInterval: 5000 });
  });

  it("should set the handler timeout to 15 seconds when called.", () => {
    expect(createFastifyAdapter().getInstance().initialConfig).toMatchObject({ handlerTimeout: 15_000 });
  });

  it("should keep the application/json content type parser when called.", () => {
    expect(createFastifyAdapter().getInstance().hasContentTypeParser("application/json")).toBeTruthy();
  });

  it("should remove the text/plain content type parser when called.", () => {
    expect(createFastifyAdapter().getInstance().hasContentTypeParser("text/plain")).toBeFalsy();
  });
});