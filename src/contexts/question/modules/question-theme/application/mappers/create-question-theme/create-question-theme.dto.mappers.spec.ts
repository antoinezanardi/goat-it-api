import { createQuestionThemeDraftEntityFromCreateDto } from "@question/modules/question-theme/application/mappers/create-question-theme/create-question-theme.dto.mappers";

import { createFakeCreateQuestionThemeDto, createFakeQuestionThemeDraft } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("Create Question Theme Dto Mappers", () => {
  describe(createQuestionThemeDraftEntityFromCreateDto, () => {
    it("should map a CreateQuestionThemeDto to a QuestionThemeDraft entity when called.", () => {
      const createQuestionThemeDto = createFakeCreateQuestionThemeDto();
      const questionThemeDraftEntity = createQuestionThemeDraftEntityFromCreateDto(createQuestionThemeDto);
      const expectedQuestionThemeDraftEntity = createFakeQuestionThemeDraft({
        slug: createQuestionThemeDto.slug,
        label: createQuestionThemeDto.label,
        aliases: createQuestionThemeDto.aliases,
        description: createQuestionThemeDto.description,
        status: "active",
      });

      expect(questionThemeDraftEntity).toStrictEqual<QuestionThemeDraft>(expectedQuestionThemeDraftEntity);
    });
  });
});