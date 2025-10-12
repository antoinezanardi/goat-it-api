import { bootstrap } from "./server/server";

try {
  void bootstrap();
} catch (error) {
  console.error("Error during application bootstrap:", error);
  process.exit(1);
}
