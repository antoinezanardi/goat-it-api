import { World } from "@cucumber/cucumber";

import type { ChildProcessWithoutNullStreams } from "node:child_process";

class CustomWorld extends World {
  public response!: Response;

  public serverProcess?: ChildProcessWithoutNullStreams;
}

export { CustomWorld };