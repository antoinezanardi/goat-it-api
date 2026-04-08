import { transformReleaseNotes } from "../helpers/transform-release-notes.mjs";

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

  return transformReleaseNotes(notes);
}

export { generateNotes };