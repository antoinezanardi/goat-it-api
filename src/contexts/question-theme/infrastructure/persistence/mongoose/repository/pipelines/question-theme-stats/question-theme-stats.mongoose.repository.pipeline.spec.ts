import { QUESTION_MONGOOSE_COLLECTION_NAME, QUESTION_STATUS_ACTIVE, QUESTION_THEME_USAGE_PERSISTENCE_FIELDS } from "@question/contracts/persistence/question.persistence.contracts.constants";

import { QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE, QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE } from "@question-theme/infrastructure/persistence/mongoose/repository/pipelines/question-theme-stats/question-theme-stats.mongoose.repository.pipeline";

describe("Question Theme Stats Mongoose Repository Pipeline", () => {
  it("should look up active questions in the published question collection when building the stage.", () => {
    expect(QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE.$lookup.from).toBe(QUESTION_MONGOOSE_COLLECTION_NAME);
  });

  it("should join the theme id to the published question theme usage field when building the stage.", () => {
    expect(QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE.$lookup).toMatchObject({
      localField: "_id",
      foreignField: QUESTION_THEME_USAGE_PERSISTENCE_FIELDS.themeId,
    });
  });

  it("should match active questions on the published status field path when building the match stage.", () => {
    expect(QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE.$lookup.pipeline[0]).toStrictEqual({
      $match: {
        [QUESTION_THEME_USAGE_PERSISTENCE_FIELDS.status]: QUESTION_STATUS_ACTIVE,
      },
    });
  });

  it("should include the active question lookup stage in the stats pipeline when read.", () => {
    expect(QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE).toContain(QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE);
  });
});