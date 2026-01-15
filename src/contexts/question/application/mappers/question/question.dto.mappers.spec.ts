import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto";
import type { QuestionThemeAssignmentDto } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto";
import type { QuestionDto } from "@question/application/dto/question/question.dto";
import type { QuestionAuthorDto } from "@question/application/dto/shared/question-author/question-author.dto";
import type { QuestionRejectionDto } from "@question/application/dto/shared/question-rejection/question-rejection.dto";
import { createQuestionAuthorDtoFromEntity, createQuestionContentDtoFromEntity, createQuestionDtoFromEntity, createQuestionRejectionDtoFromEntity, createQuestionThemeAssignmentDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";

import { createFakeQuestionDto } from "@faketories/contexts/question/dto/question/question.dto.faketory";
import { createFakeQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/question/question-theme-assignment/question-theme-assignment.dto.faketory";
import { createFakeLocalizationOptions, createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";
import { createFakeQuestionContentDto } from "@faketories/contexts/question/dto/question/question-content/question-content.dto.faketory";
import { createFakeQuestionAuthorDto } from "@faketories/contexts/question/dto/shared/question-author/question-author.dto.faketory";
import { createFakeQuestionRejectionDto } from "@faketories/contexts/question/dto/shared/question-rejection/question-rejection.dto.faketory";
import { createFakeQuestion, createFakeQuestionAuthor, createFakeQuestionContent, createFakeQuestionRejection, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";

describe("Question DTO Mappers", () => {
  describe(createQuestionRejectionDtoFromEntity, () => {
    it("should map a Question Rejection entity to a Question Rejection DTO when called.", () => {
      const questionRejection = createFakeQuestionRejection();
      const expectedQuestionRejectionDto = createFakeQuestionRejectionDto({
        type: questionRejection.type,
        comment: questionRejection.comment,
      });

      expect(createQuestionRejectionDtoFromEntity(questionRejection)).toStrictEqual<QuestionRejectionDto>(expectedQuestionRejectionDto);
    });
  });

  describe(createQuestionAuthorDtoFromEntity, () => {
    it("should map a Question Author entity to a Question Author DTO when called.", () => {
      const questionAuthor = createFakeQuestionAuthor({ role: "ai" });
      const expectedQuestionAuthorDto = createFakeQuestionAuthorDto({
        name: questionAuthor.name,
        role: questionAuthor.role,
        gameId: undefined,
      });

      expect(createQuestionAuthorDtoFromEntity(questionAuthor)).toStrictEqual<QuestionAuthorDto>(expectedQuestionAuthorDto);
    });

    it("should map a Question Author entity with role 'game' to a Question Author DTO when called.", () => {
      const gameId = "game-123";
      const questionAuthor = createFakeQuestionAuthor({
        role: "game",
        gameId,
      });
      const expectedQuestionAuthorDto = createFakeQuestionAuthorDto({
        name: questionAuthor.name,
        role: questionAuthor.role,
        gameId,
      });

      expect(createQuestionAuthorDtoFromEntity(questionAuthor)).toStrictEqual<QuestionAuthorDto>(expectedQuestionAuthorDto);
    });
  });

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
        author: createQuestionAuthorDtoFromEntity(questionEntity.author),
        status: questionEntity.status,
        rejection: createQuestionRejectionDtoFromEntity(questionRejection),
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
        author: createQuestionAuthorDtoFromEntity(questionEntity.author),
        status: questionEntity.status,
        rejection: undefined,
        sourceUrls: [...questionEntity.sourceUrls],
        createdAt: questionEntity.createdAt.toISOString(),
        updatedAt: questionEntity.updatedAt.toISOString(),
      });

      expect(createQuestionDtoFromEntity(questionEntity, localizationOptions)).toStrictEqual<QuestionDto>(expectedQuestionDto);
    });
  });
});