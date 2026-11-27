import type { SecurityHeadersOptions } from "@nestjs/common";

const STRICT_TRANSPORT_SECURITY_MAX_AGE_SECONDS = 31_536_000;

const CONTENT_SECURITY_POLICY_VALUE =
  "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';" +
  "img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';" +
  "style-src 'self' https: 'unsafe-inline'";

const STRICT_TRANSPORT_SECURITY_HEADER_VALUE = `max-age=${STRICT_TRANSPORT_SECURITY_MAX_AGE_SECONDS}`;

const PERMISSIONS_POLICY_HEADER_NAME = "Permissions-Policy";

const PERMISSIONS_POLICY_DENIED_FEATURES = ["camera", "microphone", "geolocation", "payment", "usb"] as const;

const PERMISSIONS_POLICY_HEADER_VALUE = PERMISSIONS_POLICY_DENIED_FEATURES.map(feature => `${feature}=()`).join(", ");

const OPTIONS_HTTP_METHOD = "OPTIONS";

const OPTIONS_RESPONSE_SECURITY_HEADERS = [
  ["Content-Security-Policy", CONTENT_SECURITY_POLICY_VALUE],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Cross-Origin-Resource-Policy", "same-site"],
  ["Origin-Agent-Cluster", "?1"],
  [PERMISSIONS_POLICY_HEADER_NAME, PERMISSIONS_POLICY_HEADER_VALUE],
  ["Referrer-Policy", "no-referrer"],
  ["Strict-Transport-Security", STRICT_TRANSPORT_SECURITY_HEADER_VALUE],
  ["X-Content-Type-Options", "nosniff"],
  ["X-DNS-Prefetch-Control", "off"],
  ["X-Download-Options", "noopen"],
  ["X-Frame-Options", "DENY"],
  ["X-Permitted-Cross-Domain-Policies", "none"],
  ["X-XSS-Protection", "0"],
] as const;

const RESPONSE_HEADER_NAMES_TO_REMOVE = ["X-Powered-By"] as const;

const SECURITY_HEADERS_OPTIONS = {
  contentSecurityPolicy: {
    directives: {
      upgradeInsecureRequests: false,
    },
  },
  strictTransportSecurity: {
    maxAge: STRICT_TRANSPORT_SECURITY_MAX_AGE_SECONDS,
    includeSubDomains: false,
    preload: false,
  },
  xContentTypeOptions: true,
  xFrameOptions: {
    action: "deny",
  },
  referrerPolicy: {
    policy: "no-referrer",
  },
  crossOriginResourcePolicy: {
    policy: "same-site",
  },
} as const satisfies SecurityHeadersOptions;

export {
  OPTIONS_HTTP_METHOD,
  OPTIONS_RESPONSE_SECURITY_HEADERS,
  PERMISSIONS_POLICY_HEADER_NAME,
  PERMISSIONS_POLICY_HEADER_VALUE,
  RESPONSE_HEADER_NAMES_TO_REMOVE,
  SECURITY_HEADERS_OPTIONS,
};