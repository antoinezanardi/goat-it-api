import { applyDecorators, UseGuards } from "@nestjs/common";

import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";

/**
 * Applies `AdminApiKeyGuard` to a route or controller, so the request must carry the admin `goat-it-api-key` header.
 *
 * A missing or invalid key is rejected with a 401 Unauthorized; apply it to the routes served under `/admin`.
 *
 * @example
 * ```typescript
 * @AdminAuth()
 * @Get("admin/dashboard")
 * async getAdminDashboard() {
 *   // ...
 * }
 * ```
 */
function AdminAuth(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseGuards(AdminApiKeyGuard));
}

export { AdminAuth };