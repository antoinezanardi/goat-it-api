import type { AdminQuestionThemeAssignmentDto } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto";
import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";
import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto";
import type { QuestionThemeAssignmentDto } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto";
import type { QuestionDto } from "@question/application/dto/question/question.dto";
import { createAdminQuestionDtoFromEntity, createAdminQuestionThemeAssignmentDtoFromEntity, createQuestionContentDtoFromEntity, createQuestionDtoFromEntity, createQuestionThemeAssignmentDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";
import { createAdminQuestionThemeDtoFromEntity, createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";

import { createFakeAdminQuestionDto } from "@faketories/contexts/question/dto/admin-question/admin-question.dto.faketory";
import { createFakeAdminQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.faketory";
import { createFakeQuestionContentDto } from "@faketories/contexts/question/dto/question/question-content/question-content.dto.faketory";
import { createFakeQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/question/question-theme-assignment/question-theme-assignment.dto.faketory";
import { createFakeQuestionDto } from "@faketories/contexts/question/dto/question/question.dto.faketory";
import { createFakeQuestion, createFakeQuestionContent, createFakeQuestionRejection, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeLocalizationOptions, createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

describe("Question DTO Mappers", () => {
  describe(createQuestionContentDtoFromEntity, () => {
    it("should map a Question Content entity without context nor trivia to a Question Content DTO when called.", () => {
      const localizationOptions = createFakeLocalizationOptions({ locale: "en" });

      const questionContent = createFakeQuestionContent({
        context: undefined,
        trivia: undefined,
      });
      const expectedQuestionContentDto = createFakeQuestionContentDto({
        answer: questionContent.answer.en,
        statement: questionContent.statement.en,
        context: undefined,
        trivia: undefined,
      });

      expect(createQuestionContentDtoFromEntity(questionContent, localizationOptions)).toStrictEqual<QuestionContentDto>(expectedQuestionContentDto);
    });

    it("should map a Question Content entity with context and trivia to a Question Content DTO when called.", () => {
      const localizationOptions = createFakeLocalizationOptions({ locale: "fr" });

      const questionContent = createFakeQuestionContent({
        context: createFakeLocalizedText(),
        trivia: createFakeLocalizedTexts(),
      });
      const expectedQuestionContentDto = createFakeQuestionContentDto({
        answer: questionContent.answer.fr,
        statement: questionContent.statement.fr,
        context: questionContent.context?.fr,
        trivia: questionContent.trivia?.fr,
      });

      expect(createQuestionContentDtoFromEntity(questionContent, localizationOptions)).toStrictEqual<QuestionContentDto>(expectedQuestionContentDto);
    });
  });

  describe(createQuestionThemeAssignmentDtoFromEntity, () => {
    it("should map a Question Theme Assignment entity to a Question Theme Assignment DTO when called.", () => {
      const localizationOptions = createFakeLocalizationOptions({ locale: "en" });
      const questionThemeAssignment = createFakeQuestionThemeAssignment();
      const expectedQuestionThemeAssignmentDto = createFakeQuestionThemeAssignmentDto({
        theme: createQuestionThemeDtoFromEntity(questionThemeAssignment.theme, localizationOptions),
        isPrimary: questionThemeAssignment.isPrimary,
        isHint: questionThemeAssignment.isHint,
      });
      const result = createQuestionThemeAssignmentDtoFromEntity(questionThemeAssignment, localizationOptions);

      expect(result).toStrictEqual<QuestionThemeAssignmentDto>(expectedQuestionThemeAssignmentDto);
    });
  });

  describe(createQuestionDtoFromEntity, () => {
    it("should map a Question entity to a Question DTO when called.", () => {
      const localizationOptions = createFakeLocalizationOptions({ locale: "en" });
      const questionRejection = createFakeQuestionRejection();
      const questionEntity = createFakeQuestion({
        rejection: questionRejection,
      });
      const expectedQuestionDto = createFakeQuestionDto({
        id: questionEntity.id,
        themes: questionEntity.themes.map(themeAssignment => createQuestionThemeAssignmentDtoFromEntity(themeAssignment, localizationOptions)),
        content: createQuestionContentDtoFromEntity(questionEntity.content, localizationOptions),
        cognitiveDifficulty: questionEntity.cognitiveDifficulty,
        author: questionEntity.author,
        status: questionEntity.status,
        rejection: questionEntity.rejection,
        sourceUrls: [...questionEntity.sourceUrls],
        createdAt: questionEntity.createdAt.toISOString(),
        updatedAt: questionEntity.updatedAt.toISOString(),
      });

      expect(createQuestionDtoFromEntity(questionEntity, localizationOptions)).toStrictEqual<QuestionDto>(expectedQuestionDto);
    });

    it("should map a Question entity without rejection to a Question DTO when called.", () => {
      const localizationOptions = createFakeLocalizationOptions({ locale: "en" });
      const questionEntity = createFakeQuestion({
        rejection: undefined,
      });
      const expectedQuestionDto = createFakeQuestionDto({
        id: questionEntity.id,
        themes: questionEntity.themes.map(themeAssignment => createQuestionThemeAssignmentDtoFromEntity(themeAssignment, localizationOptions)),
        content: createQuestionContentDtoFromEntity(questionEntity.content, localizationOptions),
        cognitiveDifficulty: questionEntity.cognitiveDifficulty,
        author: questionEntity.author,
        status: questionEntity.status,
        rejection: undefined,
        sourceUrls: [...questionEntity.sourceUrls],
        createdAt: questionEntity.createdAt.toISOString(),
        updatedAt: questionEntity.updatedAt.toISOString(),
      });

      expect(createQuestionDtoFromEntity(questionEntity, localizationOptions)).toStrictEqual<QuestionDto>(expectedQuestionDto);
    });
  });

  describe(createAdminQuestionThemeAssignmentDtoFromEntity, () => {
    it("should map a Question Theme Assignment entity to an Admin Question Theme Assignment DTO when called.", () => {
      const questionThemeAssignment = createFakeQuestionThemeAssignment();
      const expectedAdminQuestionThemeAssignmentDto = createFakeAdminQuestionThemeAssignmentDto({
        theme: createAdminQuestionThemeDtoFromEntity(questionThemeAssignment.theme),
        isPrimary: questionThemeAssignment.isPrimary,
        isHint: questionThemeAssignment.isHint,
      });
      const result = createAdminQuestionThemeAssignmentDtoFromEntity(questionThemeAssignment);

      expect(result).toStrictEqual<AdminQuestionThemeAssignmentDto>(expectedAdminQuestionThemeAssignmentDto);
    });
  });

  describe(createAdminQuestionDtoFromEntity, () => {
    it("should map a Question entity to an Admin Question DTO when called.", () => {
      const questionRejection = createFakeQuestionRejection();
      const questionEntity = createFakeQuestion({
        rejection: questionRejection,
      });
      const expectedAdminQuestionDto = createFakeAdminQuestionDto({
        id: questionEntity.id,
        themes: questionEntity.themes.map(themeAssignment => createAdminQuestionThemeAssignmentDtoFromEntity(themeAssignment)),
        content: questionEntity.content,
        cognitiveDifficulty: questionEntity.cognitiveDifficulty,
        author: questionEntity.author,
        status: questionEntity.status,
        rejection: questionEntity.rejection,
        sourceUrls: [...questionEntity.sourceUrls],
        createdAt: questionEntity.createdAt.toISOString(),
        updatedAt: questionEntity.updatedAt.toISOString(),
      });

      expect(createAdminQuestionDtoFromEntity(questionEntity)).toStrictEqual<AdminQuestionDto>(expectedAdminQuestionDto);
    });
  });
});