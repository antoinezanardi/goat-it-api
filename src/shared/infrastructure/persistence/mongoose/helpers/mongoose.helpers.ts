import { isObject, mapKeys, shake } from "radashi";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";

import type { PipelineStage } from "mongoose";

import type { SortOptions, SortOrder } from "@shared/domain/types/sort/sort.types";
import type { MongoSortDirection } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers.types";
import type { SemanticSortOrders } from "@shared/infrastructure/persistence/mongoose/types/mongoose.types";

function crushDataObjectEntry(entry: [string, unknown], parentKey: string, result: Record<string, unknown>): Record<string, unknown> {
  const [key, value] = entry;
  const path = parentKey ? `${parentKey}.${key}` : key;

  if (!isObject(value)) {
    // Acceptable as modifying the result object directly for recursion purposes
    // oxlint-disable-next-line no-param-reassign
    result[path] = value;

    return result;
  }

  if (Object.keys(value).length === 0) {
    // Acceptable as modifying the result object directly for recursion purposes
    // oxlint-disable-next-line no-param-reassign
    result[path] = {};
  } else {
    crushDataRecursively(value, path, result);
  }
  return result;
}

function crushDataRecursively(data: object, parentKey = "", result: Record<string, unknown> = {}): Record<string, unknown> {
  for (const entry of Object.entries(data)) {
    crushDataObjectEntry(entry, parentKey, result);
  }
  return result;
}

/**
 * Crushes a nested data object into a flat structure suitable for MongoDB patch updates applied through the `$set` operator.
 *
 * Leaf paths are dot-joined and empty nested objects are preserved, so `{ a: { b: 1 } }` becomes `{ "a.b": 1 }`.
 *
 * @param data - The nested update payload whose leaves are flattened into `$set` paths.
 */
function getCrushedDataForMongoPatchUpdate(data: Record<string, unknown>): Record<string, unknown> {
  return crushDataRecursively(data);
}

/**
 * Builds a flat `$set`-ready object for updating fields within a MongoDB array element matched by an array filter.
 *
 * 1. Strips `undefined` values (via `shake`) so only explicitly provided fields are included.
 * 2. Prefixes every remaining key with the given `arrayPath` (e.g. `"themes.$[elem]"`) to form valid MongoDB dot-notation paths.
 *
 * Useful when a modification contract has optional fields and only the defined ones should be written to the matched array element.
 *
 * @example
 * // contract = { isPrimary: true, isHint: undefined }
 * // arrayPath = "themes.$[elem]"
 * // → { "themes.$[elem].isPrimary": true }
 *
 * @param data - The object whose defined keys will become `$set` fields.
 * @param arrayPath - The MongoDB array element path prefix (e.g. `"themes.$[elem]"`).
 */
function getDefinedFieldsForMongoArrayElementUpdate(data: Record<string, unknown>, arrayPath: string): Record<string, unknown> {
  return mapKeys(shake(data), key => `${arrayPath}.${key}`);
}

/**
 * Maps a domain sort order to MongoDB's numeric direction: `asc` becomes `1`, and every other order becomes `-1`.
 */
function getMongoSortDirectionFromSortOrder(sortOrder: SortOrder): MongoSortDirection {
  return sortOrder === SORT_ORDERS[0] ? 1 : -1;
}

/**
 * Builds the aggregation pipeline stages that sort on the requested field, with `_id` as a deterministic tiebreaker.
 *
 * Fields in `semanticSortOrders` are ranked with `$indexOfArray` through a temporary `_sortPriority` field; other fields use a plain `$sort`.
 */
function buildMongooseAggregationSortStages<T extends string>(
  sortOptions: SortOptions<T>,
  semanticSortOrders: SemanticSortOrders<T> = {},
): PipelineStage[] {
  const direction = getMongoSortDirectionFromSortOrder(sortOptions.sortOrder);
  const semanticOrder = semanticSortOrders[sortOptions.sortBy];

  if (semanticOrder !== undefined) {
    return [
      { $addFields: { _sortPriority: { $indexOfArray: [[...semanticOrder], `$${sortOptions.sortBy}`] } } },
      { $sort: { _sortPriority: direction, _id: direction } },
      { $unset: "_sortPriority" },
    ];
  }
  return [{ $sort: { [sortOptions.sortBy]: direction, _id: direction } }];
}

/**
 * Builds the Mongoose sort criteria object, appending `_id` as a deterministic tiebreaker so documents sharing the sort value keep a stable order.
 */
function buildMongooseSortCriteria<T extends string>(sortOptions: SortOptions<T>): Record<string, MongoSortDirection> {
  const direction = getMongoSortDirectionFromSortOrder(sortOptions.sortOrder);

  return { [sortOptions.sortBy]: direction, _id: direction };
}

/**
 * Adds a filter to a `$match` stage only when the source array is defined and non-empty.
 *
 * `matchStage` is mutated in place, and `valueFunction` never runs for a missing or empty array, so no empty `$in` clause reaches MongoDB.
 *
 * @param items - The optional filter values; both `undefined` and `[]` leave the stage untouched.
 * @param matchStage - The match stage builder object mutated in place.
 * @param valueFunction - Builds the Mongo condition from the non-empty values only.
 */
function addArrayFilterIfNonEmpty<T>(
  items: T[] | undefined,
  matchStage: Record<string, unknown>,
  key: string,
  valueFunction: (items: T[]) => unknown,
): void {
  if (items !== undefined && items.length > 0) {
    // Acceptable as modifying the match stage builder object directly
    // oxlint-disable-next-line no-param-reassign
    matchStage[key] = valueFunction(items);
  }
}

export {
  addArrayFilterIfNonEmpty,
  buildMongooseAggregationSortStages,
  buildMongooseSortCriteria,
  getCrushedDataForMongoPatchUpdate,
  getDefinedFieldsForMongoArrayElementUpdate,
  getMongoSortDirectionFromSortOrder,
};