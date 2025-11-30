import { When } from "@cucumber/cucumber";

import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

When(/^the client retrieves all question themes(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale?: Locale) {
  const fetchOptions = createFetchOptions(locale);
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});