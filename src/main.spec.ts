import * as Server from "@server/server";

vi.mock(import("@server/server"), () => ({
  bootstrap: vi.fn<() => ReturnType<typeof Server.bootstrap>>(),
}));

describe("Main", () => {
  describe("Root", () => {
    it("should call bootstrap when file is imported.", async() => {
      await import("./main");

      expect(Server.bootstrap).toHaveBeenCalledExactlyOnceWith();
    });
  });
});