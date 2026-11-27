import { BadRequestException, Injectable } from "@nestjs/common";
import { Types } from "mongoose";

import type { PipeTransform } from "@nestjs/common";

/**
 * Validates that a route parameter is a MongoDB ObjectId and returns it unchanged as a string, without converting it.
 *
 * @throws `BadRequestException` when the value is missing, is not a string, or is not a valid ObjectId.
 */
@Injectable()
export class MongoIdPipe implements PipeTransform<unknown, string> {
  public transform(value: unknown): string {
    if (value === undefined || value === null) {
      throw new BadRequestException("Mongo ID must be provided");
    }
    if (typeof value !== "string") {
      throw new BadRequestException(`Mongo ID must be a string, but received: ${typeof value}`);
    }
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid Mongo ID: ${value}`);
    }
    return value;
  }
}