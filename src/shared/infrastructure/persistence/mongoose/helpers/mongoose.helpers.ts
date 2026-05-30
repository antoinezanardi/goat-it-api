import { isObject, mapKeys, shake } from "radashi";

import type { PipelineStage } from "mongoose";

import type { SortOptions, SortOrder } from "@shared/domain/types/sort/sort.types";
import type { SemanticSortOrders } from "@shared/infrastructure/persistence/mongoose/types/mongoose.types";

function crushDataObjectEntry(entry: [string, unknown], parentKey: string, result: Record<string, unknown>): Record<string, unknown> {
  const [key, value] = entry;
  const path = parentKey ? `${parentKey}.${key}` : key;

  if (!isObject(value)) {
    // This is acceptable since we are modifying the result object directly for recursion purposes
    // oxlint-disable-next-line no-param-reassign
    result[path] = value;

    return result;
  }

  if (Object.keys(value).length === 0) {
    // This is acceptable since we are modifying the result object directly for recursion purposes
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
 * Crushes a nested data object into a flat structure suitable for MongoDB patch updates.
 * Suitable when updating documents partially using the `$set` operator.
 * Database operation resulting from a PATCH request for example.
 * @param data
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
 * @param data - The object whose defined keys will become `$set` fields.
 * @param arrayPath - The MongoDB array element path prefix (e.g. `"themes.$[elem]"`).
 */
function getDefinedFieldsForMongoArrayElementUpdate(data: Record<string, unknown>, arrayPath: string): Record<string, unknown> {
  return mapKeys(shake(data), key => `${arrayPath}.${key}`);
}

type MongoSortDirection = 1 | -1;

function getMongoSortDirectionFromSortOrder(sortOrder: SortOrder): MongoSortDirection {
  return sortOrder === "asc" ? 1 : -1;
}

/**
 * Builds MongoDB aggregation pipeline stages for sorting.
 * For semantic fields (defined in `semanticSortOrders`), uses `$indexOfArray` to compute sort priority.
 * For regular fields, uses a simple `$sort` stage.
 * Always includes `_id` as a tiebreaker.
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

function buildMongooseSortCriteria<T extends string>(sortOptions: SortOptions<T>): Record<string, MongoSortDirection> {
  const direction = getMongoSortDirectionFromSortOrder(sortOptions.sortOrder);

  return { [sortOptions.sortBy]: direction, _id: direction };
}

export {
  buildMongooseAggregationSortStages,
  buildMongooseSortCriteria,
  getCrushedDataForMongoPatchUpdate,
  getDefinedFieldsForMongoArrayElementUpdate,
  getMongoSortDirectionFromSortOrder,
};

export type { MongoSortDirection };