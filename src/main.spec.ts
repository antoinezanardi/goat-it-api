import * as Server from "@src/infrastructure/api/server/server";

import { AppModule } from "@app/app.module";

vi.mock(import("@src/infrastructure/api/server/server"), () => ({
  bootstrap: vi.fn<typeof Server.bootstrap>(),
}));

vi.mock(import("@app/app.module"), () => ({
  AppModule: class MockedAppModule {
    public configure(): void {
      void this;
    }
  },
}));

describe("Main", () => {
  describe("Root", () => {
    it("should call bootstrap with the app module when file is imported.", async() => {
      await import("@src/main");

      expect(Server.bootstrap).toHaveBeenCalledExactlyOnceWith(AppModule);
    });
  });
});