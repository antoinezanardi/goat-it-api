import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

function findQuestionThemeBySlugOrThrow<T extends Pick<QuestionThemeDto, "slug">>(questionThemes: T[], slug: string): T {
  const questionTheme = questionThemes.find(theme => theme.slug === slug);
  if (!questionTheme) {
    throw new Error(`Question theme with slug "${slug}" not found`);
  }
  return questionTheme;
}

export {
  findQuestionThemeBySlugOrThrow,
};