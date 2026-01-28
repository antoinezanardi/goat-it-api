import type { Types } from "mongoose";

/**
 * Base schema type for Mongoose collections. Does not apply to subdocuments.
 */
type MongooseCollectionSchemaBase = {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type {
  MongooseCollectionSchemaBase,
};