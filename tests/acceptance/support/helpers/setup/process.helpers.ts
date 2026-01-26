import { APP_FORCE_KILL_TIMEOUT_MS } from "@acceptance-support/constants/app.constants";

import type { ChildProcessWithoutNullStreams } from "node:child_process";

async function forceKillAppProcessAfterTimeout(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  return new Promise<void>(resolve => {
    let isSettled = false;

    function settlePromise(): void {
      if (isSettled) {
        return;
      }
      isSettled = true;
      resolve();
    }

    const forceKillTimeout = setTimeout(() => {
      if (!serverProcess.killed) {
        serverProcess.kill("SIGKILL");
      }
      settlePromise();
    }, APP_FORCE_KILL_TIMEOUT_MS);

    serverProcess.on("exit", () => {
      clearTimeout(forceKillTimeout);
      settlePromise();
    });
  });
}

async function killAppProcess(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  serverProcess.kill("SIGTERM");

  await forceKillAppProcessAfterTimeout(serverProcess);
}

export {
  forceKillAppProcessAfterTimeout,
  killAppProcess,
};