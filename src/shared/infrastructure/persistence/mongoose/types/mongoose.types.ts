import type { Types } from "mongoose";

/**
 * Base schema type for Mongoose collections. Does not apply to subdocuments.
 */
type MongooseCollectionSchemaBase = {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Maps sortable field names to their semantic sort order arrays.
 * Fields not in this map use alphabetical/chronological MongoDB sort.
 * Fields in this map use `$indexOfArray` for custom ordering.
 */
type SemanticSortOrders<T extends string> = Partial<Record<T, readonly string[]>>;

export type {
  MongooseCollectionSchemaBase,
  SemanticSortOrders,
};