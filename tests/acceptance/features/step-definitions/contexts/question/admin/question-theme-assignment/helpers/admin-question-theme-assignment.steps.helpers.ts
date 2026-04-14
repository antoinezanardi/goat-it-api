import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function sendPostThemeAssignment(world: GoatItWorld, questionId: string, options: { apiKey?: string; body?: Record<string, unknown> } = {}): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: options.apiKey,
    method: "POST",
    body: options.body,
  });
  await world.fetchAndStoreResponse(`/admin/questions/${questionId}/themes`, fetchOptions);
}

async function sendDeleteThemeAssignment(world: GoatItWorld, themeId: string, questionId: string, options: { apiKey?: string } = {}): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: options.apiKey,
    method: "DELETE",
  });
  await world.fetchAndStoreResponse(`/admin/questions/${questionId}/themes/${themeId}`, fetchOptions);
}

async function sendPatchThemeAssignment(world: GoatItWorld, themeId: string, questionId: string, options: { apiKey?: string; body?: Record<string, unknown> } = {}): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: options.apiKey,
    method: "PATCH",
    body: options.body,
  });
  await world.fetchAndStoreResponse(`/admin/questions/${questionId}/themes/${themeId}`, fetchOptions);
}

export {
  sendPostThemeAssignment,
  sendDeleteThemeAssignment,
  sendPatchThemeAssignment,
};