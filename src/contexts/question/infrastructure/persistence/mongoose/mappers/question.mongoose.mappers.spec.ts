import { Types } from "mongoose";

import { QuestionPersistenceMappingError } from "@question/infrastructure/persistence/mongoose/errors/question.mongoose.errors";
import { createQuestionAuthorFromAggregate, createQuestionFromAggregate, createQuestionMongooseInsertPayloadFromContract, createQuestionThemeAssignmentFromQuestionThemeAggregate, createQuestionThemeAssignmentMongooseInsertPayloadFromContract } from "@question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers";
import { createQuestionThemeFromDocument } from "@question/modules/question-theme/infrastructure/persistence/mongoose/mappers/question-theme.mongoose.mappers";

import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";
import { createFakeQuestionMongooseInsertPayload, createFakeQuestionThemeAssignmentMongooseInsertPayload } from "@faketories/contexts/question/mongoose-insert-payload/question.mongoose-insert-payload.faketory";
import { createFakeQuestionCreationContract } from "@faketories/contexts/question/contracts/question.contracts.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeQuestionAggregate, createFakeQuestionAuthorAggregate, createFakeQuestionThemeAssignmentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestion, createFakeQuestionAuthor, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { QuestionMongooseInsertPayload, QuestionThemeAssignmentMongooseInsertPayload } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";
import type { Question } from "@question/domain/entities/question.types";
import type { QuestionAuthor } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";

describe("Question Mongoose Mappers", () => {
  describe(createQuestionAuthorFromAggregate, () => {
    it("should correctly map a question author when role is 'ai'.", () => {
      const questionAggregate = createFakeQuestionAggregate({
        author: createFakeQuestionAuthorAggregate({
          role: "ai",
          name: "AI Question Generator",
        }),
      });
      const expectedQuestionAuthor = createFakeQuestionAuthor({
        role: "ai",
        name: "AI Question Generator",
      });

      const result = createQuestionAuthorFromAggregate(questionAggregate);

      expect(result).toStrictEqual<QuestionAuthor>(expectedQuestionAuthor);
    });

    it("should correctly map a question author when role is 'game' and gameId is provided.", () => {
      const gameId = createFakeObjectId();
      const questionAggregate = createFakeQuestionAggregate({
        author: createFakeQuestionAuthorAggregate({
          role: "game",
          gameId,
          name: "Trivia Master",
        }),
      });
      const expectedQuestionAuthor = createFakeQuestionAuthor({
        role: "game",
        gameId: gameId.toString(),
        name: "Trivia Master",
      });
      const result = createQuestionAuthorFromAggregate(questionAggregate);

      expect(result).toStrictEqual<QuestionAuthor>(expectedQuestionAuthor);
    });

    it("should throw an error when role is 'game' and gameId is missing.", () => {
      const questionAggregate = createFakeQuestionAggregate({
        author: createFakeQuestionAuthorAggregate({
          role: "game",
          name: "Trivia Master",
        }),
      });
      questionAggregate.author.gameId = undefined;
      const expectedError = new QuestionPersistenceMappingError(questionAggregate._id.toString(), "Missing gameId for question author with role 'game'");

      expect(() => createQuestionAuthorFromAggregate(questionAggregate)).toThrowError(expectedError);
    });

    it("should throw an error when role is 'game' and gameId is not in the author object.", () => {
      const questionAggregate = createFakeQuestionAggregate();
      questionAggregate.author = {
        role: "game",
        name: "Trivia Master",
      };
      const expectedError = new QuestionPersistenceMappingError(questionAggregate._id.toString(), "Missing gameId for question author with role 'game'");

      expect(() => createQuestionAuthorFromAggregate(questionAggregate)).toThrowError(expectedError);
    });
  });

  describe(createQuestionThemeAssignmentFromQuestionThemeAggregate, () => {
    it("should correctly map a question theme assignment from aggregate when called.", () => {
      const questionThemeAssignmentAggregate = createFakeQuestionThemeAssignmentAggregate();
      const expectedQuestionThemeAssignment = createFakeQuestionThemeAssignment({
        theme: createQuestionThemeFromDocument(questionThemeAssignmentAggregate.theme),
        isPrimary: questionThemeAssignmentAggregate.isPrimary,
        isHint: questionThemeAssignmentAggregate.isHint,
      });
      const result = createQuestionThemeAssignmentFromQuestionThemeAggregate(questionThemeAssignmentAggregate);

      expect(result).toStrictEqual<QuestionThemeAssignment>(expectedQuestionThemeAssignment);
    });
  });

  describe(createQuestionFromAggregate, () => {
    it("should correctly map a question from aggregate when called.", () => {
      const questionAggregate = createFakeQuestionAggregate();
      const expectedQuestion = createFakeQuestion({
        id: questionAggregate._id.toString(),
        themes: questionAggregate.themes.map(themeAssignmentAggregate => createQuestionThemeAssignmentFromQuestionThemeAggregate(themeAssignmentAggregate)),
        content: questionAggregate.content,
        cognitiveDifficulty: questionAggregate.cognitiveDifficulty,
        author: createQuestionAuthorFromAggregate(questionAggregate),
        status: questionAggregate.status,
        rejection: questionAggregate.rejection,
        sourceUrls: new Set(questionAggregate.sourceUrls),
        createdAt: questionAggregate.createdAt,
        updatedAt: questionAggregate.updatedAt,
      });
      const result = createQuestionFromAggregate(questionAggregate);

      expect(result).toStrictEqual<Question>(expectedQuestion);
    });
  });

  describe(createQuestionThemeAssignmentMongooseInsertPayloadFromContract, () => {
    it("should map a question theme assignment creation contract to mongoose insert payload correctly when called.", () => {
      const questionThemeAssignmentCreationContract = createFakeQuestionThemeAssignmentCreationContract();
      const expectedMongooseInsertPayload = createFakeQuestionThemeAssignmentMongooseInsertPayload({
        themeId: new Types.ObjectId(questionThemeAssignmentCreationContract.themeId),
        isPrimary: questionThemeAssignmentCreationContract.isPrimary,
        isHint: questionThemeAssignmentCreationContract.isHint,
      });
      const result = createQuestionThemeAssignmentMongooseInsertPayloadFromContract(questionThemeAssignmentCreationContract);

      expect(result).toStrictEqual<QuestionThemeAssignmentMongooseInsertPayload>(expectedMongooseInsertPayload);
    });
  });

  describe(createQuestionMongooseInsertPayloadFromContract, () => {
    it("should map a question creation contract to mongoose insert payload correctly when called.", () => {
      const questionCreationContract = createFakeQuestionCreationContract();
      const expectedMongooseInsertPayload = createFakeQuestionMongooseInsertPayload({
        ...questionCreationContract,
        sourceUrls: [...questionCreationContract.sourceUrls],
        themes: questionCreationContract.themes.map(themeAssignmentCreateContract => createQuestionThemeAssignmentMongooseInsertPayloadFromContract(themeAssignmentCreateContract)),
      });

      const result = createQuestionMongooseInsertPayloadFromContract(questionCreationContract);

      expect(result).toStrictEqual<QuestionMongooseInsertPayload>(expectedMongooseInsertPayload);
    });
  });
});