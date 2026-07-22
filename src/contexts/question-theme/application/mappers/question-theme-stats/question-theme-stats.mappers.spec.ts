import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import { createQuestionThemeStatsDtoFromStats } from "@question-theme/application/mappers/question-theme-stats/question-theme-stats.mappers";

import { createFakeQuestionThemeStats } from "@faketories/contexts/question-theme/domain/question-theme-stats/question-theme-stats.faketory";

describe(createQuestionThemeStatsDtoFromStats, () => {
  it("should return total when stats are provided.", () => {
    const stats = createFakeQuestionThemeStats({ total: 5, byStatus: {}, byQuestionCount: [] });
    const result = createQuestionThemeStatsDtoFromStats(stats);

    expect(result.total).toBe(5);
  });

  it("should include all status keys with zero when byStatus is empty.", () => {
    const result = createQuestionThemeStatsDtoFromStats(createFakeQuestionThemeStats({ total: 0, byStatus: {}, byQuestionCount: [] }));

    expect(Object.keys(result.byStatus)).toStrictEqual([...QUESTION_THEME_STATUSES]);
  });

  it("should preserve active status value when provided.", () => {
    const stats = createFakeQuestionThemeStats({ total: 0, byStatus: { active: 4 }, byQuestionCount: [] });
    const result = createQuestionThemeStatsDtoFromStats(stats);

    expect(result.byStatus.active).toBe(4);
  });

  it("should default archived status to zero when not provided.", () => {
    const stats = createFakeQuestionThemeStats({ total: 0, byStatus: { active: 4 }, byQuestionCount: [] });
    const result = createQuestionThemeStatsDtoFromStats(stats);

    expect(result.byStatus.archived).toBe(0);
  });

  it("should return byQuestionCount when stats contain question count data.", () => {
    const byQC = [{ themeId: "a", themeSlug: "cinema", activeQuestionCount: 2 }];
    const stats = createFakeQuestionThemeStats({ total: 0, byStatus: {}, byQuestionCount: byQC });
    const result = createQuestionThemeStatsDtoFromStats(stats);

    expect(result.byQuestionCount).toStrictEqual(byQC);
  });
});