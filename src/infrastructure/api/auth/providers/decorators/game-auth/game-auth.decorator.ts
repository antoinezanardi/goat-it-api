import { applyDecorators, UseGuards } from "@nestjs/common";

import { GameApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/game-api-key/game-api-key.guard";

/**
 * Auth decorator that applies the GameApiKeyGuard to protect routes meant for game management access.
 *
 * @example
 * ```typescript
 * @GameAuth()
 * @Get("questions")
 * async getQuestions() {
 *   // ...
 * }
 * ```
 */
function GameAuth(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseGuards(GameApiKeyGuard));
}

export { GameAuth };