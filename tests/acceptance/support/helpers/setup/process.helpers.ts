import { APP_FORCE_KILL_TIMEOUT_MS } from "@acceptance-support/constants/app.constants";

import type { ChildProcessWithoutNullStreams } from "node:child_process";

import type { AppProcessSignal } from "@acceptance-support/types/setup.types";

function hasAppProcessExited(serverProcess: ChildProcessWithoutNullStreams): boolean {
  return serverProcess.exitCode !== null || serverProcess.signalCode !== null;
}

function killAppProcessTree(serverProcess: ChildProcessWithoutNullStreams, signal: AppProcessSignal): void {
  if (hasAppProcessExited(serverProcess)) {
    return;
  }

  const { pid } = serverProcess;
  if (pid === undefined) {
    return;
  }

  try {
    process.kill(-pid, signal);
  } catch {
    serverProcess.kill(signal);
  }
}

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
      killAppProcessTree(serverProcess, "SIGKILL");
      settlePromise();
    }, APP_FORCE_KILL_TIMEOUT_MS);

    serverProcess.on("exit", () => {
      clearTimeout(forceKillTimeout);
      settlePromise();
    });
  });
}

async function killAppProcess(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  killAppProcessTree(serverProcess, "SIGTERM");

  await forceKillAppProcessAfterTimeout(serverProcess);
}

export {
  forceKillAppProcessAfterTimeout,
  killAppProcess,
};