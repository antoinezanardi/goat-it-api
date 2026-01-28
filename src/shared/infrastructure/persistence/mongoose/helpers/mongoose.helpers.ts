import { isObject } from "radashi";

function crushDataObjectEntry(entry: [string, unknown], parentKey = "", result: Record<string, unknown> = {}): Record<string, unknown> {
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
  if (Object.keys(data).length === 0) {
    return result;
  }

  for (const entry of Object.entries(data)) {
    crushDataObjectEntry(entry, parentKey, result);
  }
  return result;
}

function getCrushedDataForMongoPatchUpdate(data: Record<string, unknown>): Record<string, unknown> {
  return crushDataRecursively(data);
}

export {
  getCrushedDataForMongoPatchUpdate,
};