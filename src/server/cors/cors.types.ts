type CorsConfig = {
  origin: string | string[] | boolean;
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
};

export type { CorsConfig };