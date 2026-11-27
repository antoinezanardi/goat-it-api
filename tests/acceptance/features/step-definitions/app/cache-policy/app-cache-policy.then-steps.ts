import { Then } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should be cached with revalidation$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderToBe("cache-control", "public, max-age=0");
});

Then(/^the response should provide the "(?<headerName>[^"]+)" validator$/u, function(this: GoatItWorld, headerName: string): void {
  this.expectLastResponseHeaderToBePresent(headerName);
});

Then(/^the response should not vary on the "Accept-Language" header$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderNotToContain("vary", "Accept-Language");
});