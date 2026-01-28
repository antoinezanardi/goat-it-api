import { isObject } from "radashi";

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

export {
  getCrushedDataForMongoPatchUpdate,
};