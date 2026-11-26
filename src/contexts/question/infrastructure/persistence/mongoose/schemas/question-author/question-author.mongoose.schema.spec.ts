import { QUESTION_AUTHOR_MONGOOSE_SCHEMA, QuestionAuthorMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question-author/question-author.mongoose.schema";

import type { QuestionAuthorRole } from "@question/domain/types/question.value-objects";

type GameIdRoleProbe = { role: QuestionAuthorRole };

type GameIdRequiredRule = (this: GameIdRoleProbe) => boolean;

type GameIdValidatorRule = (this: GameIdRoleProbe, gameId: string | undefined) => boolean;

const GAME_ID_VALIDATOR_MESSAGE = "gameId is only allowed when the author role is 'game'";

const gameIdPath = QUESTION_AUTHOR_MONGOOSE_SCHEMA.path("gameId");
const gameIdRequiredOption: unknown = gameIdPath.options.required;
const gameIdValidatorOption: unknown = gameIdPath.validators.find(validator => validator.message === GAME_ID_VALIDATOR_MESSAGE)?.validator;

function isGameIdRequiredRule(value: unknown): value is GameIdRequiredRule {
  return typeof value === "function";
}

function isGameIdValidatorRule(value: unknown): value is GameIdValidatorRule {
  return typeof value === "function";
}

const isGameIdRequired = isGameIdRequiredRule(gameIdRequiredOption) ? gameIdRequiredOption : (): boolean => false;
const isGameIdAllowed = isGameIdValidatorRule(gameIdValidatorOption) ? gameIdValidatorOption : (): boolean => false;

describe(QuestionAuthorMongooseSchema, () => {
  it("should declare a conditional gameId requirement when the schema is built.", () => {
    expect(gameIdRequiredOption).toBeTypeOf("function");
  });

  it.each<{ test: string; role: QuestionAuthorRole; expected: boolean }>([
    {
      test: "should require gameId when the author role is 'game'.",
      role: "game",
      expected: true,
    },
    {
      test: "should not require gameId when the author role is 'admin'.",
      role: "admin",
      expected: false,
    },
    {
      test: "should not require gameId when the author role is 'ai'.",
      role: "ai",
      expected: false,
    },
  ])("$test", ({ role, expected }) => {
    const isRequired = isGameIdRequired.call({ role });

    expect(isRequired).toBe(expected);
  });

  it("should declare a gameId role validator when the schema is built.", () => {
    expect(gameIdValidatorOption).toBeTypeOf("function");
  });

  it.each<{ test: string; role: QuestionAuthorRole; gameId: string | undefined; expected: boolean }>([
    {
      test: "should accept a gameId when the author role is 'game'.",
      role: "game",
      gameId: "507f1f77bcf86cd799439011",
      expected: true,
    },
    {
      test: "should accept a missing gameId when the author role is 'admin'.",
      role: "admin",
      gameId: undefined,
      expected: true,
    },
    {
      test: "should accept a missing gameId when the author role is 'ai'.",
      role: "ai",
      gameId: undefined,
      expected: true,
    },
    {
      test: "should reject a gameId when the author role is 'admin'.",
      role: "admin",
      gameId: "507f1f77bcf86cd799439011",
      expected: false,
    },
    {
      test: "should reject a gameId when the author role is 'ai'.",
      role: "ai",
      gameId: "507f1f77bcf86cd799439011",
      expected: false,
    },
  ])("$test", ({ role, gameId, expected }) => {
    const isValid = isGameIdAllowed.call({ role }, gameId);

    expect(isValid).toBe(expected);
  });
});