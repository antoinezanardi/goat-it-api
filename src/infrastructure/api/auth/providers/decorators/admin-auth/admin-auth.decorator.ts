import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiKeyAuth } from "@src/infrastructure/api/auth/providers/decorators/api-key-auth/api-key-auth.decorator";
import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";

/**
 * Auth decorator that applies the AdminApiKeyGuard to protect routes meant for admin access.
 * Must be used on routes that starts with `/admin`.
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