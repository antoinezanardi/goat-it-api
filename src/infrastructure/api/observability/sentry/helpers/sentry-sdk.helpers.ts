import { captureException, close, init } from "@sentry/nestjs";

import type { NodeOptions } from "@sentry/nestjs";

/**
 * Initializes the tracker with the options built from the validated configuration.
 */
function initSentrySdk(options: NodeOptions): void {
  init(options);
}

/**
 * Captures one exception with the given tags and returns the tracker event id.
 */
function captureSentryException(exception: Error, tags: Record<string, string>): string {
  return captureException(exception, { tags });
}

/**
 * Closes the tracker client and resolves whether its queue drained inside the given bound.
 */
// Acceptable as the boolean reports whether the queue drained, while the name states the action the caller asks for
// eslint-disable-next-line unicorn/consistent-boolean-name
async function closeSentryClient(timeoutMs: number): Promise<boolean> {
  return close(timeoutMs);
}

export {
  initSentrySdk,
  captureSentryException,
  closeSentryClient,
};