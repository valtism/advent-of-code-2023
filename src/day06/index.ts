import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

type Race = {
  time: number;
  distance: number;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // Parse races into Race[]
  const races = input.reduce<Race[]>((races, line, index) => {
    const valueName = index === 0 ? "time" : "distance";
    [...line.matchAll(/\d+/g)].forEach((value, index) => {
      const number = Number(value[0]);
      races[index] = { ...races[index], [valueName]: number };
    });
    return races;
  }, []);

  return races.reduce((product, race) => {
    // Quadratic equations
    const [min, max] = quadratic(1, -race.time, race.distance);

    // Account for min & max being integers / on the line
    const extra = Number.isInteger(max) ? 1 : 0;
    const wins = Math.floor(max) - Math.floor(min) - extra;

    // Produce product of all wins
    return product * wins;
  }, 1);
};

function quadratic(a: number, b: number, c: number) {
  const min = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (a * 2);
  const max = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (a * 2);
  return [min, max] as const;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const time = Number(input[0].replaceAll(" ", "").match(/\d+/)![0]);
  const distance = Number(input[1].replaceAll(" ", "").match(/\d+/)![0]);

  // Quadratic equations
  const [min, max] = quadratic(1, -time, distance);

  // Account for min & max being integers / on the line
  const extra = Number.isInteger(max) ? 1 : 0;
  const wins = Math.floor(max) - Math.floor(min) - extra;
  return wins;
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
        Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
        Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
