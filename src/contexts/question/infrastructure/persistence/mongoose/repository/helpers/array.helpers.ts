import { randomInt } from "node:crypto";

import type { RandomIndexGenerator } from "@question/infrastructure/persistence/mongoose/repository/helpers/array.helpers.types";

/**
 * Returns a Fisher-Yates shuffle of a copy of `items`, so the input array is never mutated.
 *
 * @param generateRandomIndex - Generates an index in `[0, upperBound)`; defaults to cryptographically random `randomInt` and is injectable for deterministic tests.
 */
function shuffleArray<T>(items: readonly T[], generateRandomIndex: RandomIndexGenerator = randomInt): T[] {
  const shuffledItems = [...items];

  for (let currentIndex = shuffledItems.length - 1; currentIndex > 0; currentIndex -= 1) {
    const swapIndex = generateRandomIndex(currentIndex + 1);
    [shuffledItems[currentIndex], shuffledItems[swapIndex]] = [shuffledItems[swapIndex], shuffledItems[currentIndex]];
  }
  return shuffledItems;
}

export { shuffleArray };