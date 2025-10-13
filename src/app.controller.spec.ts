import { AppController } from "@src/app.controller";

describe("App Controller", () => {
  describe("getHello", () => {
    const appController = new AppController();

    it("should return 'Hello World!' when called.", () => {
      expect(appController.getHello()).toBe("Hello World!");
    });
  });
});