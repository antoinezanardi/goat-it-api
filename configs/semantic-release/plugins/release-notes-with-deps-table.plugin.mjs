import { writeFile } from "node:fs/promises";

import { transformReleaseNotes } from "../helpers/transform-release-notes.mjs";

const RELEASE_NOTES_OUTPUT_PATH = "RELEASE.md";

const wrappedPluginPromise = import("@semantic-release/release-notes-generator");

function loadBasePlugin() {
  return wrappedPluginPromise;
}

async function generateNotes(pluginConfig, context) {
  const basePlugin = await loadBasePlugin();
  const notes = await basePlugin.generateNotes(pluginConfig, context);
  const transformedNotes = transformReleaseNotes(notes);

  await writeFile(RELEASE_NOTES_OUTPUT_PATH, transformedNotes, "utf8");

  return transformedNotes;
}

export { generateNotes };