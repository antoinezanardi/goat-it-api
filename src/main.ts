import { APP_CONFIG_MODULE_READY, getAppEnv } from "@src/infrastructure/api/config/helpers/config-module.helpers";
import { bootstrap } from "@src/infrastructure/api/server/server";

import { AppModule } from "@app/app.module";

async function main(): Promise<void> {
  await APP_CONFIG_MODULE_READY;

  await bootstrap(AppModule, getAppEnv().TRUST_PROXY);
}

// Acceptable as the process entrypoint is ESM-only and never loaded through require(ESM).
// oxlint-disable-next-line node/no-top-level-await
await main();

export { main };