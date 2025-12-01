import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class MongoIdPipe implements PipeTransform<unknown, string> {
  public transform(value?: unknown): string {
    if (value === undefined) {
      throw new BadRequestException("Mongo ID must be provided in the request URL");
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