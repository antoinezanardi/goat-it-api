import * as Server from "@server/server";

vi.mock("@server/server", () => ({
  bootstrap: vi.fn(),
}));

describe("Main", () => {
  describe("Root", () => {
    it("should call bootstrap when file is imported.", async() => {
      await import("./main");

      expect(Server.bootstrap).toHaveBeenCalledExactlyOnceWith();
    });
  });
});