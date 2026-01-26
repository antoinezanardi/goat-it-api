import { request as fetch } from "node:http";
import { URL } from "node:url";

import { APP_BASE_URL, APP_HEALTH_OK_STATUS, APP_HEALTH_RETRY_ATTEMPTS, APP_HEALTH_RETRY_DELAY_MS } from "@acceptance-support/constants/app.constants";

import type { ChildProcessWithoutNullStreams } from "node:child_process";

async function getApiHealth(): Promise<number> {
  const urlObject = new URL(`${APP_BASE_URL}/health`);

  return new Promise<number>(resolve => {
    const request = fetch(
      {
        hostname: urlObject.hostname,
        port: urlObject.port,
        path: `${urlObject.pathname}${urlObject.search}`,
        method: "GET",
        timeout: 1000,
      },
      response => {
        resolve(response.statusCode ?? 0);
        request.destroy();
      },
    );

    request.on("error", () => {
      resolve(0);
    });

    request.on("timeout", () => {
      request.destroy();
      resolve(0);
    });

    request.end();
  });
}

async function waitForAppToBeReady(serverProcess: ChildProcessWithoutNullStreams): Promise<ChildProcessWithoutNullStreams> {
  for (let attempt = 1; attempt <= APP_HEALTH_RETRY_ATTEMPTS; attempt++) {
    try {
      // oxlint-disable-next-line no-await-in-loop
      const status = await getApiHealth();
      if (status === APP_HEALTH_OK_STATUS) {
        return serverProcess;
      }
    } catch(error) {
      void error;
    }

    if (attempt < APP_HEALTH_RETRY_ATTEMPTS) {
      // oxlint-disable-next-line no-await-in-loop
      await new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, APP_HEALTH_RETRY_DELAY_MS);
      });
    }
  }

  throw new Error(`❌ Application did not become ready after ${APP_HEALTH_RETRY_ATTEMPTS} attempts.`);
}

export {
  getApiHealth,
  waitForAppToBeReady,
};