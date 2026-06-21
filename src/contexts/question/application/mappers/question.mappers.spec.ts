import { createAdminQuestionThemeDtoFromEntity, createQuestionThemeDtoFromEntity } from "@question-theme/application/mappers/question-theme.mappers";

import { computeQuestionStatusFromAuthorRole } from "@question/domain/rules/question.rules";
import {
  createAdminQuestionDtoFromEntity,
  createAdminQuestionThemeAssignmentDtoFromEntity,
  createQuestionContentDtoFromEntity,
  createQuestionDtoFromEntity,
  createQuestionThemeAssignmentDtoFromEntity,
  createQuestionThemeAssignmentCreationContractFromDto,
  createQuestionAuthorCreationContractFromDto,
  createQuestionContentCreationContractFromDto,
  createQuestionCreationCommandFromDto,
  createQuestionModificationCommandFromDto,
} from "@question/application/mappers/question.mappers";

import { createFakeAdminQuestionDto } from "@faketories/contexts/question/dto/admin-question/admin-question.dto.faketory";
import { createFakeAdminQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.faketory";
import { createFakeQuestionContentDto } from "@faketories/contexts/question/dto/question/question-content/question-content.dto.faketory";
import { createFakeQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/question/question-theme-assignment/question-theme-assignment.dto.faketory";
import { createFakeQuestionDto } from "@faketories/contexts/question/dto/question/question.dto.faketory";
import { createFakeQuestion, createFakeQuestionContent, createFakeQuestionRejection, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeLocalizationOptions, createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";
import { createFakeQuestionCreationCommand } from "@faketories/contexts/question/commands/question.commands.faketory";
import { createFakeQuestionContentCreationContract } from "@faketories/contexts/question/contracts/question-content/question-content.contracts.faketory";
import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";
import { createFakeQuestionAuthorCreationContract } from "@faketories/contexts/question/contracts/question-author/question-author.contracts.faketory";
import { createFakeQuestionCreationDto } from "@faketories/contexts/question/dto/question-creation/question-creation.dto.faketory";
import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeQuestionContentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-content-creation/question-content-creation.dto.faketory";
import { createFakeQuestionAuthorCreationDto } from "@faketories/contexts/question/dto/question-creation/question-author-creation/question-author-creation.dto.faketory";
import { createFakeQuestionModificationDto } from "@faketories/contexts/question/dto/question-modification/question-modification.dto.faketory";
import { createFakeQuestionModificationCommand } from "@faketories/contexts/question/commands/question-modification.commands.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

describe("Question Mappers", () => {
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

      expect(createQuestionContentDtoFromEntity(questionContent, localizationOptions)).toStrictEqual(expectedQuestionContentDto);
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

      expect(createQuestionContentDtoFromEntity(questionContent, localizationOptions)).toStrictEqual(expectedQuestionContentDto);
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

      expect(result).toStrictEqual(expectedQuestionThemeAssignmentDto);
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
        category: questionEntity.category,
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

      expect(createQuestionDtoFromEntity(questionEntity, localizationOptions)).toStrictEqual(expectedQuestionDto);
    });

    it("should map a Question entity without rejection to a Question DTO when called.", () => {
      const localizationOptions = createFakeLocalizationOptions({ locale: "en" });
      const questionEntity = createFakeQuestion({
        rejection: undefined,
      });
      const expectedQuestionDto = createFakeQuestionDto({
        id: questionEntity.id,
        category: questionEntity.category,
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

      expect(createQuestionDtoFromEntity(questionEntity, localizationOptions)).toStrictEqual(expectedQuestionDto);
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

      expect(result).toStrictEqual(expectedAdminQuestionThemeAssignmentDto);
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
        category: questionEntity.category,
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

      expect(createAdminQuestionDtoFromEntity(questionEntity)).toStrictEqual(expectedAdminQuestionDto);
    });
  });

  describe(createQuestionThemeAssignmentCreationContractFromDto, () => {
    it("should map a QuestionThemeAssignmentCreationDto to a contract when called.", () => {
      const dto = createFakeQuestionThemeAssignmentCreationDto();

      const result = createQuestionThemeAssignmentCreationContractFromDto(dto);

      const expected = createFakeQuestionThemeAssignmentCreationContract({
        themeId: dto.themeId,
        isPrimary: dto.isPrimary,
        isHint: dto.isHint,
      });

      expect(result).toStrictEqual(expected);
    });
  });

  describe(createQuestionAuthorCreationContractFromDto, () => {
    it("should map a QuestionAuthorCreationDto to a contract when called.", () => {
      const dto = createFakeQuestionAuthorCreationDto();

      const result = createQuestionAuthorCreationContractFromDto(dto);

      const expected = createFakeQuestionAuthorCreationContract({
        role: dto.role,
        name: dto.name,
      });

      expect(result).toStrictEqual(expected);
    });
  });

  describe(createQuestionContentCreationContractFromDto, () => {
    it("should map a QuestionContentCreationDto to a contract when called.", () => {
      const dto = createFakeQuestionContentCreationDto();

      const result = createQuestionContentCreationContractFromDto(dto);

      const expected = createFakeQuestionContentCreationContract({
        statement: dto.statement,
        answer: dto.answer,
        context: dto.context,
        trivia: dto.trivia,
      });

      expect(result).toStrictEqual(expected);
    });
  });

  describe(createQuestionCreationCommandFromDto, () => {
    it("should map a QuestionCreationDto to a QuestionCreationCommand when called.", () => {
      const dto = createFakeQuestionCreationDto();

      const command = createQuestionCreationCommandFromDto(dto);

      const expected = createFakeQuestionCreationCommand({
        payload: {
          category: dto.category,
          themes: dto.themes.map(theme => ({
            themeId: theme.themeId,
            isPrimary: theme.isPrimary,
            isHint: theme.isHint,
          })),
          content: {
            statement: dto.content.statement,
            answer: dto.content.answer,
            context: dto.content.context,
            trivia: dto.content.trivia,
          },
          cognitiveDifficulty: dto.cognitiveDifficulty,
          author: {
            role: dto.author.role,
            name: dto.author.name,
          },
          status: computeQuestionStatusFromAuthorRole(dto.author.role),
          sourceUrls: new Set(dto.sourceUrls),
        },
      });

      expect(command).toStrictEqual(expected);
    });
  });

  describe(createQuestionModificationCommandFromDto, () => {
    it("should return mapped QuestionModificationCommand when called.", () => {
      const questionId = createFakeObjectId().toString();
      const questionModificationDto = createFakeQuestionModificationDto();
      const expectedCommand = createFakeQuestionModificationCommand({
        questionId,
        payload: {
          category: questionModificationDto.category,
          cognitiveDifficulty: questionModificationDto.cognitiveDifficulty,
          sourceUrls: questionModificationDto.sourceUrls,
          content: questionModificationDto.content,
        },
      });

      const result = createQuestionModificationCommandFromDto(questionId, questionModificationDto);

      expect(result).toStrictEqual(expectedCommand);
    });
  });
});