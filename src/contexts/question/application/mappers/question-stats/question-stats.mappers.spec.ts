import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";
import { createQuestionStatsDtoFromStats } from "@question/application/mappers/question-stats/question-stats.mappers";

import { createFakeQuestionStats } from "@faketories/contexts/question/domain/question-stats/question-stats.faketory";

import type { QuestionStats } from "@question/domain/types/question.types";

describe(createQuestionStatsDtoFromStats, () => {
  const emptyStats = createFakeQuestionStats({
    total: 0,
    byStatus: {},
    byCategory: {},
    byCognitiveDifficulty: {},
    byAuthorRole: {},
    byRejectionType: {},
  });

  it("should return total from stats when stats are provided.", () => {
    const stats = createFakeQuestionStats({ total: 7 });
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.total).toBe(7);
  });

  it("should include all status keys when byStatus is empty.", () => {
    const result = createQuestionStatsDtoFromStats(emptyStats);

    expect(Object.keys(result.byStatus)).toStrictEqual([...QUESTION_STATUSES]);
  });

  it("should preserve active status value when byStatus contains it.", () => {
    const stats = createFakeQuestionStats({ byStatus: { active: 3 } });
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byStatus.active).toBe(3);
  });

  it("should default pending status to zero when not provided.", () => {
    const stats = createFakeQuestionStats({ byStatus: { active: 3 } });
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byStatus.pending).toBe(0);
  });

  it.each<{ fieldName: keyof QuestionStats; keysArray: readonly string[] }>([
    { fieldName: "byCategory", keysArray: QUESTION_CATEGORIES },
    { fieldName: "byCognitiveDifficulty", keysArray: QUESTION_COGNITIVE_DIFFICULTIES },
    { fieldName: "byAuthorRole", keysArray: QUESTION_AUTHOR_ROLES },
    { fieldName: "byRejectionType", keysArray: QUESTION_REJECTION_TYPES },
  ])("should include all $fieldName keys when $fieldName is empty.", ({ fieldName, keysArray }) => {
    const stats = createFakeQuestionStats({ [fieldName]: {} as QuestionStats[typeof fieldName] });
    const result = createQuestionStatsDtoFromStats(stats);

    expect(Object.keys(result[fieldName])).toStrictEqual([...keysArray]);
  });

  it("should merge provided category value when byCategory has values.", () => {
    const stats = createFakeQuestionStats({
      total: 1,
      byCategory: { trivia: 1 },
    });
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byCategory.trivia).toBe(1);
  });

  it("should keep non-provided category at zero when byCategory has partial values.", () => {
    const stats = createFakeQuestionStats({
      total: 1,
      byCategory: { trivia: 1 },
    });
    const result = createQuestionStatsDtoFromStats(stats);

    expect(result.byCategory.lexicon).toBe(0);
  });
});