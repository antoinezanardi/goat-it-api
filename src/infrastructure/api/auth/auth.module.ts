import { Module } from "@nestjs/common";

import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";
import { GameApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/game-api-key/game-api-key.guard";

@Module({
  providers: [AdminApiKeyGuard, GameApiKeyGuard],
  exports: [AdminApiKeyGuard, GameApiKeyGuard],
})
export class AuthModule {}