type PromoteToPrimaryQuestionThemeAssignmentModifyPayload = {
  isPrimary: boolean;
};

function buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload(): PromoteToPrimaryQuestionThemeAssignmentModifyPayload {
  return { isPrimary: true };
}

const PROMOTE_TO_PRIMARY_QUESTION_THEME_ASSIGNMENT_MODIFY_PAYLOAD = Object.freeze(buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload());

export {
  PROMOTE_TO_PRIMARY_QUESTION_THEME_ASSIGNMENT_MODIFY_PAYLOAD,
  buildPromoteToPrimaryQuestionThemeAssignmentModifyPayload,
};