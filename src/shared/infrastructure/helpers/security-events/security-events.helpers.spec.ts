import {
  getSecurityEventRoute,
  logAuthFailedEvent,
  logRequestErrorEvent,
  logRequestThrottledEvent,
  logRequestValidationFailedEvent,
} from "@shared/infrastructure/helpers/security-events/security-events.helpers";

import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

describe("Security Events Helpers", () => {
  describe(getSecurityEventRoute, () => {
    it.each<{ test: string; request: { routeOptions?: { url?: string } }; expectedRoute: string }>([
      {
        test: "should return the matched route template when the request carries one.",
        request: { routeOptions: { url: "/questions/:id" } },
        expectedRoute: "/questions/:id",
      },
      {
        test: "should return unknown when the request carries no route options.",
        request: {},
        expectedRoute: "unknown",
      },
      {
        test: "should return unknown when the route options carry no template.",
        request: { routeOptions: {} },
        expectedRoute: "unknown",
      },
      {
        test: "should return an empty route template as-is when the request carries one.",
        request: { routeOptions: { url: "" } },
        expectedRoute: "",
      },
    ])("$test", ({ request, expectedRoute }) => {
      expect(getSecurityEventRoute(request)).toBe(expectedRoute);
    });
  });

  describe(logAuthFailedEvent, () => {
    it("should log the auth failed event with the allow-listed fields when called.", () => {
      const logger = getMockedLoggerInstance();

      logAuthFailedEvent(logger, {
        route: "/admin/questions",
        audience: "admin",
        reason: "invalid",
      });

      expect(logger.warn).toHaveBeenCalledExactlyOnceWith({
        event: "auth.failed",
        status: 401,
        route: "/admin/questions",
        audience: "admin",
        reason: "invalid",
      }, "API key authentication failed");
    });
  });

  describe(logRequestValidationFailedEvent, () => {
    it("should log the validation failed event with the issue count when called.", () => {
      const logger = getMockedLoggerInstance();

      logRequestValidationFailedEvent(logger, {
        route: "/admin/questions",
        issueCount: 3,
      });

      expect(logger.warn).toHaveBeenCalledExactlyOnceWith({
        event: "request.validation.failed",
        status: 400,
        route: "/admin/questions",
        issueCount: 3,
      }, "Request validation failed");
    });
  });

  describe(logRequestThrottledEvent, () => {
    it("should log the throttled event with the retry delay when called.", () => {
      const logger = getMockedLoggerInstance();

      logRequestThrottledEvent(logger, {
        route: "/questions/:id",
        retryAfterSeconds: 12,
      });

      expect(logger.warn).toHaveBeenCalledExactlyOnceWith({
        event: "request.throttled",
        status: 429,
        route: "/questions/:id",
        retryAfterSeconds: 12,
      }, "Request throttled");
    });
  });

  describe(logRequestErrorEvent, () => {
    it("should log the request error event with the stack when the stack is provided.", () => {
      const logger = getMockedLoggerInstance();

      logRequestErrorEvent(logger, {
        route: "/questions/:id",
        errorClass: "TypeError",
        stack: "    at findQuestion (/app/dist/question.js:12:3)",
      });

      expect(logger.error).toHaveBeenCalledExactlyOnceWith({
        event: "request.error",
        status: 500,
        route: "/questions/:id",
        errorClass: "TypeError",
        stack: "    at findQuestion (/app/dist/question.js:12:3)",
      }, "Unhandled request error");
    });

    it("should omit the stack when it is undefined.", () => {
      const logger = getMockedLoggerInstance();

      logRequestErrorEvent(logger, {
        route: "/questions/:id",
        errorClass: "NonErrorThrown",
      });

      expect(logger.error).toHaveBeenCalledExactlyOnceWith({
        event: "request.error",
        status: 500,
        route: "/questions/:id",
        errorClass: "NonErrorThrown",
      }, "Unhandled request error");
    });

    it("should not define a stack property when the stack is undefined.", () => {
      const logger = getMockedLoggerInstance();

      logRequestErrorEvent(logger, {
        route: "/questions/:id",
        errorClass: "NonErrorThrown",
      });
      const [loggedEvent] = vi.mocked(logger.error).mock.calls[0];

      expect(loggedEvent).not.toHaveProperty("stack");
    });
  });
});