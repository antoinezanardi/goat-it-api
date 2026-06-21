import {
  createQuestionThemeAssignmentCreationCommandFromDto,
  createQuestionThemeAssignmentModificationCommandFromDto,
} from "@question/application/mappers/question-theme-assignment.mappers";

import { createFakeQuestionThemeAssignmentCreationCommand } from "@faketories/contexts/question/commands/question-theme-assignment/commands/question-theme-assignment.commands.faketory";
import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";
import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeQuestionThemeAssignmentModificationDto } from "@faketories/contexts/question/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.faketory";

describe("Question Theme Assignment Mappers", () => {
  describe(createQuestionThemeAssignmentCreationCommandFromDto, () => {
    it("should create a command with questionId and payload from dto when called.", () => {
      const dto = createFakeQuestionThemeAssignmentCreationDto();
      const command = createQuestionThemeAssignmentCreationCommandFromDto("q-1", dto);
      const expectedCommand = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
        payload: createFakeQuestionThemeAssignmentCreationContract(dto),
      });

      expect(command).toStrictEqual(expectedCommand);
    });
  });

  describe(createQuestionThemeAssignmentModificationCommandFromDto, () => {
    it("should create a command with questionId, themeId and payload from dto when called.", () => {
      const dto = createFakeQuestionThemeAssignmentModificationDto({ isPrimary: true, isHint: false });
      const command = createQuestionThemeAssignmentModificationCommandFromDto("q-1", "theme-1", dto);

      expect(command).toStrictEqual({
        questionId: "q-1",
        themeId: "theme-1",
        payload: {
          isPrimary: dto.isPrimary,
          isHint: dto.isHint,
        },
      });
    });
  });
});