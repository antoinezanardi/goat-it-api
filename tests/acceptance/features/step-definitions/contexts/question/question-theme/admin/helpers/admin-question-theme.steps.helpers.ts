import { expect } from "expect";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";

import type { ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/question-theme/admin/datatables/admin-question-theme.datatables.schemas";

import type { z } from "zod";

function expectAdminQuestionThemeDtoToMatch(
  adminQuestionThemeDto: AdminQuestionThemeDto,
  expectedAdminQuestionThemeDto: z.infer<typeof ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA>,
): void {
  expect(adminQuestionThemeDto.slug).toBe(expectedAdminQuestionThemeDto.slug);
  expect(adminQuestionThemeDto.status).toBe(expectedAdminQuestionThemeDto.status);
}

export {
  expectAdminQuestionThemeDtoToMatch,
};