import type { QuestionThemePersistenceShape } from "@question-theme/contracts/persistence/question-theme.persistence.contracts";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

function createQuestionThemeFromPersistenceShape(questionThemePersistenceShape: QuestionThemePersistenceShape): QuestionTheme {
  return {
    id: questionThemePersistenceShape._id.toString(),
    slug: questionThemePersistenceShape.slug,
    label: questionThemePersistenceShape.label,
    aliases: questionThemePersistenceShape.aliases,
    description: questionThemePersistenceShape.description,
    color: questionThemePersistenceShape.color,
    status: questionThemePersistenceShape.status,
    createdAt: questionThemePersistenceShape.createdAt,
    updatedAt: questionThemePersistenceShape.updatedAt,
  };
}

export { createQuestionThemeFromPersistenceShape };