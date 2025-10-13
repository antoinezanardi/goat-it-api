import { AppController } from "./app.controller";

describe("App Controller", () => {
  describe("getHello", () => {
    it("should return 'Hello World!' when called.", () => {
      expect(new AppController()["getHello"]()).toBe("Hello World!");
    });
  });
});