import { createQuestionThemeCreationCommandFromDto, createQuestionThemeModificationCommandFromDto } from "@question-theme/application/mappers/question-theme.mappers";

import { createFakeQuestionThemeCreationDto, createFakeQuestionThemeModificationDto } from "@faketories/contexts/question-theme/dto/question-theme.dto.faketory";
import { createFakeQuestionThemeCreationCommand, createFakeQuestionThemeModificationCommand } from "@faketories/contexts/question-theme/commands/question-theme.commands.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

describe(createQuestionThemeCreationCommandFromDto, () => {
  it("should map a QuestionThemeCreationDto to a QuestionThemeCreationCommand when called.", () => {
    const questionThemeCreationDto = createFakeQuestionThemeCreationDto();
    const questionThemeCreationCommand = createQuestionThemeCreationCommandFromDto(questionThemeCreationDto);
    const expectedQuestionThemeCreationCommand = createFakeQuestionThemeCreationCommand({
      payload: {
        slug: questionThemeCreationDto.slug,
        label: questionThemeCreationDto.label,
        aliases: questionThemeCreationDto.aliases,
        description: questionThemeCreationDto.description,
        color: questionThemeCreationDto.color,
        status: "active",
      },
    });

    expect(questionThemeCreationCommand).toStrictEqual(expectedQuestionThemeCreationCommand);
  });
});

describe(createQuestionThemeModificationCommandFromDto, () => {
  it("should return mapped QuestionThemeModificationCommand when called.", () => {
    const questionThemeId = createFakeObjectId().toString();
    const questionThemeModificationDto = createFakeQuestionThemeModificationDto({
      slug: "new-slug",
    });
    const expectedUpdateCommand = createFakeQuestionThemeModificationCommand({
      questionThemeId,
      payload: {
        slug: questionThemeModificationDto.slug,
        label: questionThemeModificationDto.label,
        aliases: questionThemeModificationDto.aliases,
        description: questionThemeModificationDto.description,
        color: questionThemeModificationDto.color,
      },
    });
    const result = createQuestionThemeModificationCommandFromDto(questionThemeId, questionThemeModificationDto);

    expect(result).toStrictEqual(expectedUpdateCommand);
  });
});