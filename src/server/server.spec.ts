import { bootstrap } from "./server";
import * as NestCore from "@nestjs/core";
import * as Fastify from "@nestjs/platform-fastify";
import type { Mock } from "vitest";

vi.mock("@nestjs/core");
vi.mock("../app.module", () => ({
  AppModule: { name: "MockedModule" },
}));

describe("Server", () => {
  beforeEach(() => {
    (NestCore.NestFactory.create as Mock).mockResolvedValue({
      enableShutdownHooks: vi.fn(),
      listen: vi.fn().mockResolvedValue(undefined),
      getUrl: vi.fn().mockResolvedValue("http://mocked-host:9090"),
    });
  });

  describe("bootstrap", () => {
    it("should create from NestFactory when called.", async () => {
      await bootstrap();

      expect(NestCore.NestFactory.create).toHaveBeenCalledExactlyOnceWith({ name: "MockedModule" }, expect.any(Fastify.FastifyAdapter));
    });

    it("should enable shutdown hooks when called.", async () => {
      const app = await bootstrap();

      expect(app.enableShutdownHooks).toHaveBeenCalledExactlyOnceWith();
    });

    it("should listen on the default host and port when none are provided.", async () => {
      const app = await bootstrap();

      expect(app.listen).toHaveBeenCalledExactlyOnceWith({ host: "0.0.0.0", port: 3000 });
    });

    it("should listen on the provided host and port when they are provided.", async () => {
      process.env.HOST = "127.0.0.1";
      process.env.PORT = "8080";

      const app = await bootstrap();

      expect(app.listen).toHaveBeenCalledExactlyOnceWith({ host: "127.0.0.1", port: 8080 });
    });

    it("should get app url when called.", async () => {
      const app = await bootstrap();

      expect(app.getUrl).toHaveBeenCalledExactlyOnceWith();
    });

    it("should log the app url when called.", async () => {
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await bootstrap();

      expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith("🐐 Goat It API is running on: http://mocked-host:9090");
    });

    it("should return the app when called.", async () => {
      const app = await bootstrap();

      expect(app).toStrictEqual({
        enableShutdownHooks: expect.any(Function),
        listen: expect.any(Function),
        getUrl: expect.any(Function),
      });
    });
  });
});