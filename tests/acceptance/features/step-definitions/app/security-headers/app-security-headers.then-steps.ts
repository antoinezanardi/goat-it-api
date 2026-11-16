import { Then } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain the baseline security headers$/u, function(this: GoatItWorld): void {
  const expectedSecurityHeaders: readonly (readonly [string, string])[] = [
    [
      "content-security-policy",
      "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';" +
      "img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';" +
      "style-src 'self' https: 'unsafe-inline'",
    ],
    ["cross-origin-opener-policy", "same-origin"],
    ["cross-origin-resource-policy", "same-site"],
    ["origin-agent-cluster", "?1"],
    ["permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()"],
    ["referrer-policy", "no-referrer"],
    ["strict-transport-security", "max-age=31536000"],
    ["x-content-type-options", "nosniff"],
    ["x-dns-prefetch-control", "off"],
    ["x-download-options", "noopen"],
    ["x-frame-options", "DENY"],
    ["x-permitted-cross-domain-policies", "none"],
    ["x-xss-protection", "0"],
  ];

  for (const [headerName, headerValue] of expectedSecurityHeaders) {
    this.expectLastResponseHeaderToBe(headerName, headerValue);
  }
});

Then(/^the response should not expose the "X-Powered-By" header$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderToBeAbsent("x-powered-by");
});

Then(/^the preflight response should have no body$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderToBe("content-length", "0");
});

Then(/^the preflight response should keep the application CORS allow list$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderToBe("access-control-allow-origin", "*");
  this.expectLastResponseHeaderToBe("access-control-allow-methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  this.expectLastResponseHeaderToBe("access-control-allow-headers", "Content-Type, Authorization");
});