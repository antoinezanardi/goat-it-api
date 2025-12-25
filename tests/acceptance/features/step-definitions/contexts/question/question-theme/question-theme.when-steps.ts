import { When } from "@cucumber/cucumber";

import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

When(/^the client retrieves all question themes(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale?: Locale) {
  const fetchOptions = createFetchOptions(locale);
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the admin retrieves all question themes$/u, async function(this: GoatItWorld) {
  await this.fetchAndStoreResponse("/admin/question-themes");
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)"(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, id: string, locale?: Locale) {
  const fetchOptions = createFetchOptions(locale);
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});

When(/^the admin retrieves the question theme with id "(?<id>[^"]+)"$/u, async function(this: GoatItWorld, id: string) {
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`);
});

When(/^the admin creates a new question theme with an empty payload$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions(undefined, {
    method: "POST",
    body: JSON.stringify({}),
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin creates a new question theme with the request payload$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions(undefined, {
    method: "POST",
    body: JSON.stringify(this.payload),
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin modifies the question theme with id "(?<id>[^"]+)" with an empty payload$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions(undefined, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin modifies the question theme with id "(?<id>[^"]+)" with the request payload$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions(undefined, {
    method: "PATCH",
    body: JSON.stringify(this.payload),
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin archives the question theme with id "(?<id>[^"]+)"$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions(undefined, {
    method: "POST",
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}/archive`, fetchOptions);
});