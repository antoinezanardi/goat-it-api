import { isObject, mapKeys, shake } from "radashi";

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

export {
  getCrushedDataForMongoPatchUpdate,
  getDefinedFieldsForMongoArrayElementUpdate,
};