import type { QuestionThemeAssignmentModificationDto } from "@question/application/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.shape";

function buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload(): QuestionThemeAssignmentModificationDto {
  return { isPrimary: true };
}

const PROMOTE_TO_PRIMARY_QUESTION_THEME_ASSIGNMENT_MODIFY_PAYLOAD = Object.freeze(buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload());

export {
  PROMOTE_TO_PRIMARY_QUESTION_THEME_ASSIGNMENT_MODIFY_PAYLOAD,
  buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload,
};