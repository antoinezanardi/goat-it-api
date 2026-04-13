import { createQuestionThemeAssignmentModificationCommandFromDto } from "@question/application/mappers/question-theme-assignment/question-theme-assignment-modification/question-theme-assignment-modification.dto.mappers";

import { createFakeQuestionThemeAssignmentModificationDto } from "@faketories/contexts/question/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.faketory";

describe("Question Theme Assignment Modification DTO Mappers", () => {
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