import { createQuestionModificationCommandFromDto } from "@question/application/mappers/question-modification/question-modification.dto.mappers";

import { createFakeQuestionModificationDto } from "@faketories/contexts/question/dto/question-modification/question-modification.dto.faketory";
import { createFakeQuestionModificationCommand } from "@faketories/contexts/question/commands/question-modification.commands.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

describe("Question Modification Dto Mappers", () => {
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