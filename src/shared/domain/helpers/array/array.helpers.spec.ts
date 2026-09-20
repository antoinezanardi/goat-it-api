import { shuffleArray } from "@shared/domain/helpers/array/array.helpers";

type RandomIndexGenerator = (maxExclusive: number) => number;

function createDeterministicRandomIndexGenerator(sequence: number[]): RandomIndexGenerator {
  let callCount = 0;

  return (): number => {
    const value = sequence[callCount];
    callCount += 1;

    return value;
  };
}

describe(shuffleArray, () => {
  it("should return an empty array when called with an empty array.", () => {
    const shuffled = shuffleArray([], createDeterministicRandomIndexGenerator([]));

    expect(shuffled).toStrictEqual<number[]>([]);
  });

  it("should return a new array instance when called.", () => {
    const items = ["a", "b", "c"];
    const generateRandomIndex = createDeterministicRandomIndexGenerator([1, 0]);

    const shuffled = shuffleArray(items, generateRandomIndex);

    expect(shuffled).not.toBe(items);
  });

  it("should not mutate the input array when called.", () => {
    const items = ["a", "b", "c", "d"];
    const itemsCopy = [...items];

    shuffleArray(items, createDeterministicRandomIndexGenerator([3, 2, 1]));

    expect(items).toStrictEqual<string[]>(itemsCopy);
  });

  it.each<number>([0, 1])("should return the input array unchanged when input length is %s.", length => {
    const items = ["only"].slice(0, length);
    const generateRandomIndex = vi.fn<RandomIndexGenerator>();

    const shuffled = shuffleArray(items, generateRandomIndex);

    expect(shuffled).toStrictEqual<string[]>(items);
  });

  it("should not call the random index generator when called with a single element.", () => {
    const generateRandomIndex = vi.fn<RandomIndexGenerator>();

    shuffleArray(["only"], generateRandomIndex);

    expect(generateRandomIndex).not.toHaveBeenCalled();
  });

  it("should call the random index generator once per element except the first with the correct maximum bound when called.", () => {
    const generateRandomIndex = vi.fn<RandomIndexGenerator>().mockReturnValue(0);

    shuffleArray(["a", "b", "c", "d"], generateRandomIndex);

    expect(generateRandomIndex.mock.calls).toStrictEqual<[number][]>([[4], [3], [2]]);
  });

  it("should shuffle elements deterministically when the random index generator returns zero for every swap.", () => {
    const items = ["a", "b", "c", "d"];

    const shuffled = shuffleArray(items, createDeterministicRandomIndexGenerator([0, 0, 0]));

    expect(shuffled).toStrictEqual<string[]>(["b", "c", "d", "a"]);
  });

  it("should place elements according to the random index generator swap indexes when called.", () => {
    const items = ["a", "b", "c", "d"];

    const shuffled = shuffleArray(items, createDeterministicRandomIndexGenerator([2, 1, 0]));

    expect(shuffled).toStrictEqual<string[]>(["d", "a", "b", "c"]);
  });

  it("should preserve all elements when shuffled.", () => {
    const items = ["a", "b", "c", "d", "e"];

    const shuffled = shuffleArray(items, createDeterministicRandomIndexGenerator([1, 0, 2, 0]));

    expect([...shuffled].toSorted((first, second) => first.localeCompare(second))).toStrictEqual<string[]>(["a", "b", "c", "d", "e"]);
  });

  it("should use the crypto randomInt generator by default when no generator is provided.", () => {
    const items = ["a", "b", "c", "d", "e"];

    const shuffled = shuffleArray(items);

    expect([...shuffled].toSorted((first, second) => first.localeCompare(second))).toStrictEqual<string[]>(["a", "b", "c", "d", "e"]);
  });
});