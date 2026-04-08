import { writeFile } from "node:fs/promises";

import { transformReleaseNotes } from "../helpers/transform-release-notes.mjs";

const RELEASE_NOTES_OUTPUT_PATH = "RELEASE.md";

let wrappedPlugin;

async function loadBasePlugin() {
  if (!wrappedPlugin) {
    wrappedPlugin = await import("@semantic-release/release-notes-generator");
  }
  return wrappedPlugin;
}

async function generateNotes(pluginConfig, context) {
  const basePlugin = await loadBasePlugin();
  const notes = await basePlugin.generateNotes(pluginConfig, context);
  const transformedNotes = transformReleaseNotes(notes);

  await writeFile(RELEASE_NOTES_OUTPUT_PATH, transformedNotes, "utf8");

  return transformedNotes;
}

export { generateNotes };