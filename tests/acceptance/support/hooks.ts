import http from "node:http";
import https from "node:https";

import { After, Before, BeforeAll } from "@cucumber/cucumber";

import { buildAppForAcceptanceTests, killAppProcess, serveAppForAcceptanceTests } from "@acceptance-support/app/app.helpers";

import type { CustomWorld } from "@acceptance-support/world/world.types";

const DEFAULT_HOST = process.env.HOST ?? "0.0.0.0";
const DEFAULT_PORT = Number(process.env.PORT ?? "3000");
const BASE_URL = `http://${DEFAULT_HOST === "0.0.0.0" ? "localhost" : DEFAULT_HOST}:${DEFAULT_PORT}`;

const WAIT_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 500;

async function performHeadRequest(urlString: string, timeoutMs = 2000): Promise<boolean> {
  return new Promise(resolve => {
    try {
      const urlObject = new URL(urlString);
      const client = urlObject.protocol === "https:" ? https : http;
      const request = client.request(
        {
          method: "GET",
          hostname: urlObject.hostname,
          port: urlObject.port,
          path: urlObject.pathname + urlObject.search,
          timeout: timeoutMs,
        },
        res => {
          const status = res.statusCode ?? 0;
          // consider 2xx and 3xx as success
          resolve(status >= 200 && status < 400);
          res.resume();
        },
      );

      request.on("error", () => resolve(false));
      request.on("timeout", () => {
        try {
          request.destroy();
        } catch {
          // ignore
        }
        resolve(false);
      });

      request.end();
    } catch {
      resolve(false);
    }
  });
}

async function waitForHttp(url: string, timeoutMs = WAIT_TIMEOUT_MS, intervalMs = POLL_INTERVAL_MS): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(() => {
      globalThis.clearInterval(intervalId);
      reject(new Error(`Timed out waiting for ${url} after ${timeoutMs}ms`));
    }, timeoutMs);

    const intervalId = globalThis.setInterval(async() => {
      // call the lightweight HTTP check
      const ok = await performHeadRequest(url, Math.min(intervalMs, 2000));
      if (ok) {
        globalThis.clearTimeout(timeoutId);
        globalThis.clearInterval(intervalId);
        resolve();
      }
    }, intervalMs);
  });
}

BeforeAll(function() {
  buildAppForAcceptanceTests();
});

Before(async function(this: CustomWorld) {
  this.serverProcess = serveAppForAcceptanceTests();

  // 3) wait for the server to respond on /
  await waitForHttp(`${BASE_URL}/`, WAIT_TIMEOUT_MS, POLL_INTERVAL_MS);
});

After(function(this: CustomWorld) {
  killAppProcess(this.serverProcess);
});