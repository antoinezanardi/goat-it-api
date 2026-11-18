import { FastifyAdapter } from "@nestjs/platform-fastify";

import { createFastifyAdapter } from "@src/infrastructure/api/server/fastify/helpers/fastify.helpers";
import { REQUEST_ID_UUID_V4_PATTERN } from "@src/infrastructure/api/server/request-id/constants/request-id.constants";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

describe(createFastifyAdapter, () => {
  it("should return a Fastify adapter when called.", () => {
    expect(createFastifyAdapter(false)).toBeInstanceOf(FastifyAdapter);
  });

  it("should set the body limit to 512 KiB when called.", () => {
    expect(createFastifyAdapter(false).getInstance().initialConfig.bodyLimit).toBe(524_288);
  });

  it("should set the Node request timeout to 30 seconds when called.", () => {
    expect(createFastifyAdapter(false).getHttpServer().requestTimeout).toBe(30_000);
  });

  it("should set the Node headers timeout to 30 seconds when called.", () => {
    expect(createFastifyAdapter(false).getHttpServer().headersTimeout).toBe(30_000);
  });

  it("should set the Node connections checking interval to 5 seconds when called.", () => {
    expect(createFastifyAdapter(false).getHttpServer()).toMatchObject({ connectionsCheckingInterval: 5000 });
  });

  it("should set the handler timeout to 15 seconds when called.", () => {
    expect(createFastifyAdapter(false).getInstance().initialConfig).toMatchObject({ handlerTimeout: 15_000 });
  });

  it("should keep the application/json content type parser when called.", () => {
    expect(createFastifyAdapter(false).getInstance().hasContentTypeParser("application/json")).toBeTruthy();
  });

  it("should remove the text/plain content type parser when called.", () => {
    expect(createFastifyAdapter(false).getInstance().hasContentTypeParser("text/plain")).toBeFalsy();
  });

  describe("client identity", () => {
    function createIpCollectingInstance(trustProxy: false | string): { fastifyInstance: FastifyInstance; resolvedIps: string[] } {
      const fastifyInstance = createFastifyAdapter(trustProxy).getInstance();
      const resolvedIps: string[] = [];
      fastifyInstance.addHook("onRequest", (request: FastifyRequest, _reply: FastifyReply, done: () => void): void => {
        resolvedIps.push(request.ip);
        done();
      });

      return { fastifyInstance, resolvedIps };
    }

    it("should resolve the forwarded client address when the immediate peer is the configured proxy.", async() => {
      const { fastifyInstance, resolvedIps } = createIpCollectingInstance("127.0.0.1");

      await fastifyInstance.inject({ method: "GET", url: "/", remoteAddress: "127.0.0.1", headers: { "x-forwarded-for": "203.0.113.7" } });

      expect(resolvedIps).toStrictEqual(["203.0.113.7"]);
    });

    it("should resolve a distinct client address for each forwarded client when both arrive through the configured proxy.", async() => {
      const { fastifyInstance, resolvedIps } = createIpCollectingInstance("127.0.0.1");

      await fastifyInstance.inject({ method: "GET", url: "/", remoteAddress: "127.0.0.1", headers: { "x-forwarded-for": "203.0.113.7" } });
      await fastifyInstance.inject({ method: "GET", url: "/", remoteAddress: "127.0.0.1", headers: { "x-forwarded-for": "203.0.113.8" } });

      expect(resolvedIps).toStrictEqual(["203.0.113.7", "203.0.113.8"]);
    });

    it("should keep one shared client address when an untrusted peer forges a forwarded address.", async() => {
      const { fastifyInstance, resolvedIps } = createIpCollectingInstance("127.0.0.1");

      await fastifyInstance.inject({ method: "GET", url: "/", remoteAddress: "198.18.0.9", headers: { "x-forwarded-for": "203.0.113.7" } });
      await fastifyInstance.inject({ method: "GET", url: "/", remoteAddress: "198.18.0.9", headers: { "x-forwarded-for": "203.0.113.8" } });

      expect(resolvedIps).toStrictEqual(["198.18.0.9", "198.18.0.9"]);
    });

    it("should ignore a forwarded client address when proxy trust is disabled.", async() => {
      const { fastifyInstance, resolvedIps } = createIpCollectingInstance(false);

      await fastifyInstance.inject({ method: "GET", url: "/", remoteAddress: "127.0.0.1", headers: { "x-forwarded-for": "203.0.113.7" } });

      expect(resolvedIps).toStrictEqual(["127.0.0.1"]);
    });
  });

  describe("request identifier", () => {
    it("should generate a UUID request identifier when the caller sends a request id header.", async() => {
      const fastifyInstance = createFastifyAdapter(false).getInstance();
      const requestIds: string[] = [];
      fastifyInstance.addHook("onRequest", (request: FastifyRequest, _reply: FastifyReply, done: () => void): void => {
        requestIds.push(request.id);
        done();
      });

      await fastifyInstance.inject({ method: "GET", url: "/", headers: { "request-id": "caller-supplied-request-id" } });

      expect(requestIds).toStrictEqual([expect.stringMatching(REQUEST_ID_UUID_V4_PATTERN)]);
    });
  });
});