import { APP_CONFIG_MODULE_READY } from "@src/infrastructure/api/config/config.module";
import { validate } from "@src/infrastructure/api/config/helpers/env.helpers";
import { bootstrap } from "@src/infrastructure/api/server/server";

import { AppModule } from "@app/app.module";

async function main(): Promise<void> {
  await APP_CONFIG_MODULE_READY;

  const appEnv = validate(process.env);

  await bootstrap(AppModule, appEnv.TRUST_PROXY);
}

void main();

export { main };