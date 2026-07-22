import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";
import { createQuestionStatsDtoFromStats } from "@question/application/mappers/question-stats/question-stats.mappers";

import type { QuestionStats } from "@question/domain/types/question.types";

describe(createQuestionStatsDtoFromStats, () => {
  const emptyStats: QuestionStats = {
    total: 0,
    byStatus: {} as QuestionStats["byStatus"],
    byCategory: {} as QuestionStats["byCategory"],
    byCognitiveDifficulty: {} as QuestionStats["byCognitiveDifficulty"],
    byAuthorRole: {} as QuestionStats["byAuthorRole"],
    byRejectionType: {} as QuestionStats["byRejectionType"],
  };

  it("should return total from stats when stats are provided.", () => {
    const stats: QuestionStats = { ...emptyStats, total: 7 };
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.total).toBe(7);
  });

  it("should include all status keys when byStatus is empty.", () => {
    const result = createQuestionStatsDtoFromStats(emptyStats);

    expect(Object.keys(result.byStatus)).toStrictEqual([...QUESTION_STATUSES]);
  });

  it("should preserve active status value when byStatus contains it.", () => {
    const stats: QuestionStats = { ...emptyStats, byStatus: { active: 3 } as QuestionStats["byStatus"] };
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byStatus.active).toBe(3);
  });

  it("should default pending status to zero when not provided.", () => {
    const stats: QuestionStats = { ...emptyStats, byStatus: { active: 3 } as QuestionStats["byStatus"] };
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byStatus.pending).toBe(0);
  });

  it("should include all category keys when byCategory is empty.", () => {
    const result = createQuestionStatsDtoFromStats(emptyStats);

    expect(Object.keys(result.byCategory)).toStrictEqual([...QUESTION_CATEGORIES]);
  });

  it("should include all cognitive difficulty keys when byCognitiveDifficulty is empty.", () => {
    const result = createQuestionStatsDtoFromStats(emptyStats);

    expect(Object.keys(result.byCognitiveDifficulty)).toStrictEqual([...QUESTION_COGNITIVE_DIFFICULTIES]);
  });

  it("should include all author role keys when byAuthorRole is empty.", () => {
    const result = createQuestionStatsDtoFromStats(emptyStats);

    expect(Object.keys(result.byAuthorRole)).toStrictEqual([...QUESTION_AUTHOR_ROLES]);
  });

  it("should include all rejection type keys when byRejectionType is empty.", () => {
    const result = createQuestionStatsDtoFromStats(emptyStats);

    expect(Object.keys(result.byRejectionType)).toStrictEqual([...QUESTION_REJECTION_TYPES]);
  });

  it("should merge provided category value when byCategory has values.", () => {
    const stats: QuestionStats = {
      ...emptyStats,
      total: 1,
      byCategory: { trivia: 1 } as QuestionStats["byCategory"],
    };
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byCategory.trivia).toBe(1);
  });

  it("should keep non-provided category at zero when byCategory has partial values.", () => {
    const stats: QuestionStats = {
      ...emptyStats,
      total: 1,
      byCategory: { trivia: 1 } as QuestionStats["byCategory"],
    };
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byCategory.lexicon).toBe(0);
  });
});