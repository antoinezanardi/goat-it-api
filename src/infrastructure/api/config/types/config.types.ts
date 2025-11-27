type ServerConfigFromEnv = {
  host: string;
  port: number;
};

type CorsConfigFromEnv = {
  origin: string;
};

type MongoDatabaseConfigFromEnv = {
  host: string;
  port: number;
  database: string;
};

export type { ServerConfigFromEnv, CorsConfigFromEnv, MongoDatabaseConfigFromEnv };