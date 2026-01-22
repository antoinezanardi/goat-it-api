import type { QuestionCreationCommand } from "@question/domain/commands/question.commands";
import type { QuestionAuthorCreationContract } from "@question/domain/contracts/question-author/question-author.contracts";
import type { QuestionContentCreationContract } from "@question/domain/contracts/question-content/question-content.contracts";
import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import { computeQuestionStatusFromAuthorRole } from "@question/domain/policies/question-creation/question-creation.policies";
import {
  createQuestionContentCreationContractFromDto,
  createQuestionAuthorCreationContractFromDto,
  createQuestionThemeAssignmentCreationContractFromDto,
  createQuestionCreationCommandFromDto,
} from "@question/application/mappers/question-creation/question-creation.dto.mappers";

import { createFakeQuestionCreationCommand } from "@faketories/contexts/question/commands/question.commands.faketory";
import { createFakeQuestionContentCreationContract } from "@faketories/contexts/question/contracts/question-content/question-content.contracts.faketory";
import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";
import { createFakeQuestionAuthorCreationContract } from "@faketories/contexts/question/contracts/question-author/question-author.contracts.faketory";
import { createFakeQuestionCreationDto } from "@faketories/contexts/question/dto/question-creation/question-creation.dto.faketory";
import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeQuestionContentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-content-creation/question-content-creation.dto.faketory";
import { createFakeQuestionAuthorCreationDto } from "@faketories/contexts/question/dto/question-creation/question-author-creation/question-author-creation.dto.faketory";

describe("Question Creation Dto Mappers", () => {
  describe(createQuestionThemeAssignmentCreationContractFromDto, () => {
    it("should map a QuestionThemeAssignmentCreationDto to a contract when called.", () => {
      const dto = createFakeQuestionThemeAssignmentCreationDto();

      const result = createQuestionThemeAssignmentCreationContractFromDto(dto);

      const expected = createFakeQuestionThemeAssignmentCreationContract({
        themeId: dto.themeId,
        isPrimary: dto.isPrimary,
        isHint: dto.isHint,
      });

      expect(result).toStrictEqual<QuestionThemeAssignmentCreationContract>(expected);
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

      expect(result).toStrictEqual<QuestionAuthorCreationContract>(expected);
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

      expect(result).toStrictEqual<QuestionContentCreationContract>(expected);
    });
  });

  describe(createQuestionCreationCommandFromDto, () => {
    it("should map a QuestionCreationDto to a QuestionCreationCommand when called.", () => {
      const dto = createFakeQuestionCreationDto();

      const command = createQuestionCreationCommandFromDto(dto);

      const expected = createFakeQuestionCreationCommand({
        payload: {
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
        },
      });

      expect(command).toStrictEqual<QuestionCreationCommand>(expected);
    });
  });
});