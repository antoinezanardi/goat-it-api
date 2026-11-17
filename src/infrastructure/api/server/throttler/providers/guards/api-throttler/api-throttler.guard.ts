import { createHash } from "node:crypto";

import { HttpException, Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

import { MINIMUM_RETRY_AFTER_SECONDS, RETRY_AFTER_HEADER_NAME, TOO_MANY_REQUESTS_ERROR_BODY } from "@src/infrastructure/api/server/throttler/constants/throttler.constants";

import type { ExecutionContext } from "@nestjs/common";
import type { ThrottlerLimitDetail } from "@nestjs/throttler";

/**
 * Rate-limits every business route with the two configured API-wide, per-client budgets.
 *
 * The storage key hashes the tier name and the library-normalized tracker only, so all routes of a tier share one budget per
 * client. The library's per-tier retry headers are suppressed in favour of one plain `Retry-After` in seconds, and an
 * over-budget request is rejected with the shared 429 error envelope, which carries no client identity or counter state.
 */
@Injectable()
export class ApiThrottlerGuard extends ThrottlerGuard {
  // Acceptable as the override must stay an instance method to match the base class contract.
  // oxlint-disable-next-line eslint/class-methods-use-this
  protected override generateKey(_context: ExecutionContext, tracker: string, throttlerName: string): string {
    return createHash("sha256")
      .update(`${throttlerName}:${tracker}`)
      .digest("hex");
  }

  protected override setResponseHeader(response: Record<string, unknown>, name: string, value: string | number): void {
    if (name.startsWith(RETRY_AFTER_HEADER_NAME)) {
      return;
    }
    super.setResponseHeader(response, name, value);
  }

  // Acceptable as the override rejects instead of awaiting, while the base class declares a Promise return type.
  // oxlint-disable-next-line typescript/require-await
  protected override async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
    const { res } = this.getRequestResponse(context);
    super.setResponseHeader(res, RETRY_AFTER_HEADER_NAME, Math.max(MINIMUM_RETRY_AFTER_SECONDS, throttlerLimitDetail.timeToBlockExpire));

    throw new HttpException(TOO_MANY_REQUESTS_ERROR_BODY, TOO_MANY_REQUESTS_ERROR_BODY.statusCode);
  }
}