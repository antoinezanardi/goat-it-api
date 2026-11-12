import { applyDecorators, UseGuards } from "@nestjs/common";

import { GameApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/game-api-key/game-api-key.guard";

/**
 * Applies `GameApiKeyGuard` to a route or controller, so the request must carry the game `goat-it-api-key` header.
 *
 * A missing or invalid key is rejected with a 401 Unauthorized; the game key cannot call admin routes.
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