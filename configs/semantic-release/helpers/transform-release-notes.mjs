const DEPS_LINE_PATTERN = /^\* \*\*deps(?:\*\*:|:\*\*)\s+/u;
const SECTION_HEADER_PATTERN = /^### .+/u;
const VERSION_HEADER_PATTERN = /^## .+/u;
const TRAILING_REFS_PATTERN = /\s+\(\[.*$/u;
const UPDATE_DESCRIPTION_PATTERN = /^update\s+(?:dependency\s+)?(?<packageName>.+?)(?:\s+to\s+(?<packageVersion>\S+))?$/u;

const UPGRADED_DEPS_SECTION_TITLE = "### 📦 Upgraded Dependencies";

function isDepsLine(line) {
  return DEPS_LINE_PATTERN.test(line);
}

function isSectionHeader(line) {
  return SECTION_HEADER_PATTERN.test(line);
}

function isVersionHeader(line) {
  return VERSION_HEADER_PATTERN.test(line);
}

function isNonDepsSectionHeader(line) {
  return isSectionHeader(line) && !isVersionHeader(line);
}

function extractDependencyInfo(line) {
  const description = line
    .replace(DEPS_LINE_PATTERN, "")
    .replace(TRAILING_REFS_PATTERN, "")
    .trim();

  const match = description.match(UPDATE_DESCRIPTION_PATTERN);

  if (!match) {
    return { name: description, version: "" };
  }
  return { name: match.groups.packageName.trim(), version: match.groups.packageVersion?.trim() ?? "" };
}

function deduplicateDependencies(dependencies) {
  const seen = new Map();

  for (const dep of dependencies) {
    seen.set(dep.name, dep.version);
  }
  return [...seen.entries()].map(([name, version]) => ({ name, version }));
}

function buildDependencyTable(dependencies) {
  if (dependencies.length === 0) {
    return "";
  }

  const lines = [
    "",
    UPGRADED_DEPS_SECTION_TITLE,
    "",
    "| Package | Version |",
    "| --- | --- |",
  ];

  for (const dep of dependencies) {
    lines.push(`| ${dep.name} | ${dep.version} |`);
  }
  return lines.join("\n");
}

function truncateToIndex(array, targetIndex) {
  while (array.length > 0 && array.length > targetIndex) {
    array.pop();
  }
}

function cleanPreviousEmptySection(filtered, sectionStartIndex, hasContent) {
  if (sectionStartIndex !== -1 && !hasContent) {
    truncateToIndex(filtered, sectionStartIndex);
  }
}

function removeDepsLinesAndCleanSections(lines) {
  const filtered = [];
  let hasContent = false;
  let sectionStartIndex = -1;

  for (const line of lines) {
    if (isNonDepsSectionHeader(line)) {
      cleanPreviousEmptySection(filtered, sectionStartIndex, hasContent);
      sectionStartIndex = filtered.length;
      hasContent = false;
      filtered.push(line);
    } else if (!isDepsLine(line)) {
      if (line.startsWith("* ") && sectionStartIndex !== -1) {
        hasContent = true;
      }

      filtered.push(line);
    }
  }

  cleanPreviousEmptySection(filtered, sectionStartIndex, hasContent);

  return filtered;
}

const SECOND_TO_LAST_OFFSET = 2;

function hasConsecutiveTrailingBlanks(lines) {
  return lines.length > 1 &&
    lines[lines.length - 1].trim() === "" &&
    lines[lines.length - SECOND_TO_LAST_OFFSET].trim() === "";
}

function normalizeTrailingBlankLines(lines) {
  while (hasConsecutiveTrailingBlanks(lines)) {
    lines.pop();
  }

  if (lines.length > 0 && lines[lines.length - 1].trim() !== "") {
    lines.push("");
  }
  return lines;
}

function transformReleaseNotes(notes) {
  if (typeof notes !== "string") {
    return "";
  }

  const lines = notes.split("\n");
  const dependencies = lines.filter(isDepsLine).map(extractDependencyInfo);

  if (dependencies.length === 0) {
    return notes;
  }

  const deduplicated = deduplicateDependencies(dependencies);
  const cleanedLines = removeDepsLinesAndCleanSections(lines);
  const normalizedLines = normalizeTrailingBlankLines(cleanedLines);
  const table = buildDependencyTable(deduplicated);

  return `${normalizedLines.join("\n")}${table}\n`;
}

export {
  buildDependencyTable,
  deduplicateDependencies,
  extractDependencyInfo,
  isDepsLine,
  removeDepsLinesAndCleanSections,
  transformReleaseNotes,
};