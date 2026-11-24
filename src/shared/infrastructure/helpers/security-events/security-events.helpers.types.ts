type AuthFailureReason = "missing" | "invalid" | "unknown";

type AuthFailedSecurityEventContext = {
  route: string;
  audience: "admin" | "game";
  reason: AuthFailureReason;
};

type RequestValidationFailedSecurityEventContext = {
  route: string;
  issueCount: number;
};

type RequestThrottledSecurityEventContext = {
  route: string;
  retryAfterSeconds: number;
};

type RequestErrorSecurityEventContext = {
  route: string;
  errorClass: string;
  stack?: string;
};

type SecurityEventRouteCarrier = {
  routeOptions?: {
    url?: string;
  };
};

export type {
  AuthFailedSecurityEventContext,
  AuthFailureReason,
  RequestErrorSecurityEventContext,
  RequestThrottledSecurityEventContext,
  RequestValidationFailedSecurityEventContext,
  SecurityEventRouteCarrier,
};