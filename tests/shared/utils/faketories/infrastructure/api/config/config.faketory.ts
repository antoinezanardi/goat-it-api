import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

import type { CorsConfigFromEnv, MongoDatabaseConfigFromEnv, ServerConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

function createFakeServerConfigFromEnv(serverConfig: Partial<ServerConfigFromEnv> = {}): ServerConfigFromEnv {
  const fakeAppEnv = createFakeAppEnv();

  return {
    host: fakeAppEnv.SERVER_HOST,
    port: fakeAppEnv.SERVER_PORT,
    ...serverConfig,
  };
}

function createFakeCorsConfigFromEnv(corsConfig: Partial<CorsConfigFromEnv> = {}): CorsConfigFromEnv {
  const fakeAppEnv = createFakeAppEnv();

  return {
    origin: fakeAppEnv.CORS_ORIGIN,
    ...corsConfig,
  };
}

function createFakeMongoDatabaseConfigFromEnv(mongoDatabaseConfig: Partial<MongoDatabaseConfigFromEnv> = {}): MongoDatabaseConfigFromEnv {
  const fakeAppEnv = createFakeAppEnv();

  return {
    host: fakeAppEnv.MONGODB_HOST,
    port: fakeAppEnv.MONGODB_PORT,
    database: fakeAppEnv.MONGODB_DATABASE,
    ...mongoDatabaseConfig,
  };
}

export {
  createFakeServerConfigFromEnv,
  createFakeCorsConfigFromEnv,
  createFakeMongoDatabaseConfigFromEnv,
};