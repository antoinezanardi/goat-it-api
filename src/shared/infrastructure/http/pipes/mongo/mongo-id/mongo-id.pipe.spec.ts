import { BadRequestException } from "@nestjs/common";

import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";

describe("Mongo Id Pipe", () => {
  describe(MongoIdPipe.prototype.transform, () => {
    it("should return value when value is a valid mongo id.", () => {
      const pipe = new MongoIdPipe();
      const validMongoId = "507f1f77bcf86cd799439011";
      const result = pipe.transform(validMongoId);

      expect(result).toBe(validMongoId);
    });

    it.each<{
      test: string;
      errorMessage: string;
      value: unknown;
    }>([
      {
        test: "should throw BadRequestException when value is undefined.",
        errorMessage: "Mongo ID must be provided in the request URL",
        value: undefined,
      },
      {
        test: "should throw BadRequestException when value is not a string.",
        errorMessage: "Mongo ID must be a string, but received: number",
        value: 123,
      },
      {
        test: "should throw BadRequestException when value is an invalid mongo id.",
        errorMessage: "Invalid Mongo ID: invalid-mongo-id",
        value: "invalid-mongo-id",
      },
    ])("$test", ({ errorMessage, value }) => {
      const pipe = new MongoIdPipe();
      const error = new BadRequestException(errorMessage);

      expect(() => pipe.transform(value)).toThrowError(error);
    });
  });
});