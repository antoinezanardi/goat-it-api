import { randomInt } from "node:crypto";

type RandomIndexGenerator = (maxExclusive: number) => number;

function shuffleArray<T>(items: readonly T[], generateRandomIndex: RandomIndexGenerator = randomInt): T[] {
  const shuffledItems = [...items];

  for (let currentIndex = shuffledItems.length - 1; currentIndex > 0; currentIndex -= 1) {
    const swapIndex = generateRandomIndex(currentIndex + 1);
    [shuffledItems[currentIndex], shuffledItems[swapIndex]] = [shuffledItems[swapIndex], shuffledItems[currentIndex]];
  }
  return shuffledItems;
}

export { shuffleArray };