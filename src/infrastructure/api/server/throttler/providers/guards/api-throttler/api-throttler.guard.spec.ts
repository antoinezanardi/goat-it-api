import { createHash } from "node:crypto";

import { HttpException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ThrottlerModule } from "@nestjs/throttler";

import { RETRY_AFTER_HEADER_NAME, THROTTLER_DEFAULT_TIER_NAME, THROTTLER_SUSTAINED_TIER_NAME, TOO_MANY_REQUESTS_ERROR_BODY } from "@src/infrastructure/api/server/throttler/constants/throttler.constants";
import { ApiThrottlerGuard } from "@src/infrastructure/api/server/throttler/providers/guards/api-throttler/api-throttler.guard";

import type { ExecutionContext } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

type FakeResponse = {
  headers: Map<string, string>;
  header: (name: string, value: string | number) => void;
};

function createFakeResponse(): FakeResponse {
  const headers: Map<string, string> = new Map();

  function header(name: string, value: string | number): void {
    headers.set(name, String(value));
  }
  return { headers, header };
}

function createFakeExecutionContext(handlerName: string, clientIp: string, response: FakeResponse): ExecutionContext {
  const request = { ip: clientIp, headers: {} };
  const handler = { name: handlerName };

  return {
    getClass: () => ApiThrottlerGuard,
    getHandler: () => handler,
    switchToHttp: () => ({ getRequest: () => request, getResponse: () => response }),
  } as ExecutionContext;
}

async function createApiThrottlerGuard(defaultLimit: number, sustainedLimit: number): Promise<{ apiThrottlerGuard: ApiThrottlerGuard; module: TestingModule }> {
  const module = await Test.createTestingModule({
    imports: [
      ThrottlerModule.forRoot({
        throttlers: [
          { name: THROTTLER_DEFAULT_TIER_NAME, ttl: 1000, limit: defaultLimit },
          { name: THROTTLER_SUSTAINED_TIER_NAME, ttl: 60_000, limit: sustainedLimit },
        ],
      }),
    ],
    providers: [ApiThrottlerGuard],
  }).compile();

  return { apiThrottlerGuard: module.get<ApiThrottlerGuard>(ApiThrottlerGuard), module };
}

function getThrottlingException(caught: unknown): HttpException {
  if (!(caught instanceof HttpException)) {
    throw new TypeError("The guard did not throw an HttpException.");
  }
  return caught;
}

async function activateAndCatch(apiThrottlerGuard: ApiThrottlerGuard, context: ExecutionContext): Promise<unknown> {
  try {
    return await apiThrottlerGuard.canActivate(context);
  } catch(error) {
    return error;
  }
}

describe(ApiThrottlerGuard, () => {
  let apiThrottlerGuard: ApiThrottlerGuard;
  let module: TestingModule;
  let fakeResponse: FakeResponse;

  beforeEach(async() => {
    vi.useFakeTimers();
    ({ apiThrottlerGuard, module } = await createApiThrottlerGuard(1, 10));
    fakeResponse = createFakeResponse();
  });

  afterEach(async() => {
    await module.close();
    vi.useRealTimers();
  });

  // Acceptable as private method is accessed via bracket notation for symbol-based describe (U3/HP2).
  // oxlint-disable-next-line typescript/dot-notation
  describe(ApiThrottlerGuard.prototype["generateKey"], () => {
    it("should hash the tier name and the tracker with sha256 when called.", () => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      const expectedKey = createHash("sha256")
        .update(`${THROTTLER_DEFAULT_TIER_NAME}:127.0.0.1`)
        .digest("hex");

      expect(apiThrottlerGuard["generateKey"](context, "127.0.0.1", THROTTLER_DEFAULT_TIER_NAME)).toBe(expectedKey);
    });

    it("should return the same key for two different business handlers when the client and the tier are identical.", () => {
      const firstContext = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      const secondContext = createFakeExecutionContext("findQuestions", "127.0.0.1", fakeResponse);
      const firstKey = apiThrottlerGuard["generateKey"](firstContext, "127.0.0.1", THROTTLER_DEFAULT_TIER_NAME);

      expect(apiThrottlerGuard["generateKey"](secondContext, "127.0.0.1", THROTTLER_DEFAULT_TIER_NAME)).toBe(firstKey);
    });

    it("should return different keys when the client trackers differ.", () => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      const firstKey = apiThrottlerGuard["generateKey"](context, "127.0.0.1", THROTTLER_DEFAULT_TIER_NAME);

      expect(apiThrottlerGuard["generateKey"](context, "2001:db8:0:1::/64", THROTTLER_DEFAULT_TIER_NAME)).not.toBe(firstKey);
    });

    it("should return different keys when the tier names differ.", () => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      const defaultTierKey = apiThrottlerGuard["generateKey"](context, "127.0.0.1", THROTTLER_DEFAULT_TIER_NAME);

      expect(apiThrottlerGuard["generateKey"](context, "127.0.0.1", THROTTLER_SUSTAINED_TIER_NAME)).not.toBe(defaultTierKey);
    });

    it("should not expose the raw tracker in the returned key when called.", () => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      const key = apiThrottlerGuard["generateKey"](context, "127.0.0.1", THROTTLER_DEFAULT_TIER_NAME);

      expect(key).not.toContain("127.0.0.1");
    });
  });

  describe(ApiThrottlerGuard.prototype.canActivate, () => {
    it("should return true when the client is below both budgets.", async() => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);

      await expect(apiThrottlerGuard.canActivate(context)).resolves.toBe(true);
    });

    it.each<{ test: string; headerName: string; expectedValue: string }>([
      { test: "should expose the default tier limit header when the client is below both budgets.", headerName: "X-RateLimit-Limit", expectedValue: "1" },
      { test: "should expose the default tier remaining header when the client is below both budgets.", headerName: "X-RateLimit-Remaining", expectedValue: "0" },
      { test: "should expose the default tier reset header in seconds when the client is below both budgets.", headerName: "X-RateLimit-Reset", expectedValue: "1" },
      { test: "should expose the sustained tier limit header when the client is below both budgets.", headerName: "X-RateLimit-Limit-sustained", expectedValue: "10" },
      { test: "should expose the sustained tier remaining header when the client is below both budgets.", headerName: "X-RateLimit-Remaining-sustained", expectedValue: "9" },
      { test: "should expose the sustained tier reset header in seconds when the client is below both budgets.", headerName: "X-RateLimit-Reset-sustained", expectedValue: "60" },
    ])("$test", async({ headerName, expectedValue }) => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);

      await apiThrottlerGuard.canActivate(context);

      expect(fakeResponse.headers.get(headerName)).toBe(expectedValue);
    });

    it("should throw the curated 429 envelope when the default tier budget is exhausted.", async() => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      await apiThrottlerGuard.canActivate(context);
      const caught = await activateAndCatch(apiThrottlerGuard, context);

      expect(getThrottlingException(caught).getResponse()).toStrictEqual(TOO_MANY_REQUESTS_ERROR_BODY);
    });

    it("should expose a plain Retry-After header in seconds when the default tier budget is exhausted.", async() => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      await apiThrottlerGuard.canActivate(context);
      await activateAndCatch(apiThrottlerGuard, context);

      expect(fakeResponse.headers.get(RETRY_AFTER_HEADER_NAME)).toBe("1");
    });

    it("should expose only the plain retry header when the default tier budget is exhausted.", async() => {
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      await apiThrottlerGuard.canActivate(context);
      await activateAndCatch(apiThrottlerGuard, context);
      const retryHeaderNames = fakeResponse.headers.keys().filter(name => name.toLowerCase().startsWith(RETRY_AFTER_HEADER_NAME.toLowerCase())).toArray();

      expect(retryHeaderNames).toStrictEqual([RETRY_AFTER_HEADER_NAME]);
    });

    it("should throw the curated 429 envelope when the sustained tier budget is exhausted.", async() => {
      const { apiThrottlerGuard: sustainedGuard, module: sustainedModule } = await createApiThrottlerGuard(5, 1);
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      await sustainedGuard.canActivate(context);
      const caught = await activateAndCatch(sustainedGuard, context);

      expect(getThrottlingException(caught).getResponse()).toStrictEqual(TOO_MANY_REQUESTS_ERROR_BODY);

      await sustainedModule.close();
    });

    it("should expose a plain Retry-After header in seconds when the sustained tier budget is exhausted.", async() => {
      const { apiThrottlerGuard: sustainedGuard, module: sustainedModule } = await createApiThrottlerGuard(5, 1);
      const context = createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse);
      await sustainedGuard.canActivate(context);
      await activateAndCatch(sustainedGuard, context);

      expect(fakeResponse.headers.get(RETRY_AFTER_HEADER_NAME)).toBe("60");

      await sustainedModule.close();
    });

    it("should share one budget across two different business handlers when the same client calls them.", async() => {
      const { apiThrottlerGuard: sharedGuard, module: sharedModule } = await createApiThrottlerGuard(2, 10);
      await sharedGuard.canActivate(createFakeExecutionContext("getApiMetadata", "127.0.0.1", fakeResponse));
      await sharedGuard.canActivate(createFakeExecutionContext("findQuestions", "127.0.0.1", fakeResponse));
      const caught = await activateAndCatch(sharedGuard, createFakeExecutionContext("findQuestionThemes", "127.0.0.1", fakeResponse));

      expect(getThrottlingException(caught).getResponse()).toStrictEqual(TOO_MANY_REQUESTS_ERROR_BODY);

      await sharedModule.close();
    });
  });

  // Acceptable as private method is accessed via bracket notation for symbol-based describe (U3/HP2).
  // oxlint-disable-next-line typescript/dot-notation
  describe(ApiThrottlerGuard.prototype["setResponseHeader"], () => {
    it("should not write a response header when the name is a retry header.", () => {
      apiThrottlerGuard["setResponseHeader"](fakeResponse, `${RETRY_AFTER_HEADER_NAME}-${THROTTLER_SUSTAINED_TIER_NAME}`, 60);

      expect(fakeResponse.headers.size).toBe(0);
    });

    it("should forward a rate-limit header when the name is a rate-limit header.", () => {
      apiThrottlerGuard["setResponseHeader"](fakeResponse, "X-RateLimit-Limit", 20);

      expect(fakeResponse.headers.get("X-RateLimit-Limit")).toBe("20");
    });
  });
});