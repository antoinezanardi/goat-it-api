import { createQuestionThemeAssignmentCreationCommandFromDto } from "@question/application/mappers/question-theme-assignment/question-theme-assignment-creation/question-theme-assignment-creation.dto.mappers";
import type { QuestionThemeAssignmentCreationCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment.commands";

import { createFakeQuestionThemeAssignmentCreationCommand } from "@faketories/contexts/question/commands/question-theme-assignment/commands/question-theme-assignment.commands.faketory";
import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";
import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";

describe("Question Theme Assignment Creation DTO Mappers", () => {
  describe(createQuestionThemeAssignmentCreationCommandFromDto, () => {
    it("should create a command with questionId and payload from dto when called.", () => {
      const dto = createFakeQuestionThemeAssignmentCreationDto();
      const command = createQuestionThemeAssignmentCreationCommandFromDto("q-1", dto);
      const expectedCommand = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
        payload: createFakeQuestionThemeAssignmentCreationContract(dto),
      });

      expect(command).toStrictEqual<QuestionThemeAssignmentCreationCommand>(expectedCommand);
    });
  });
});