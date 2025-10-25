import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { z } from "zod";

import { CONFIGURATION } from "@app/modules/config/configuration";
import { ENVIRONMENT_SCHEMA, parseErrors } from "@app/modules/config/environment.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [CONFIGURATION],
      validate: (config) => {
        const parsed = ENVIRONMENT_SCHEMA.safeParse(config);
        if (!parsed.success) {
          // TODO [+winston]: Replace with proper logger (Winston) Linked issue : https://github.com/antoinezanardi/goat-it-api/issues/21
          // eslint-disable-next-line no-console
          console.error("❌ Invalid environment variables:", parseErrors(parsed.error));
          throw new Error("Invalid environment variables");
        }

        return parsed.data;
      },
    }),
  ],
})
export class AppConfigModule {}
