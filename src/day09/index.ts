import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const extrapolatedValues = input.map((row) => {
    const nums = row.split(" ").map(Number);
    let done = false;
    const progress = [nums];
    for (let i = 0; !done; i++) {
      if (progress[i].every((num) => num === 0)) {
        break;
      }
      progress[i + 1] = progress[i].reduce<number[]>(
        (acc, curr, index, array) => {
          if (index === array.length - 1) return acc;
          acc[index] = array[index + 1] - curr;
          return acc;
        },
        [],
      );
    }
    return progress.reduce((sum, nums) => sum + nums.at(-1)!, 0);
  });

  return extrapolatedValues.reduce((a, b) => a + b);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const extrapolatedValues = input.map((row) => {
    const nums = row.split(" ").map(Number);
    let done = false;
    const progress = [nums];
    for (let i = 0; !done; i++) {
      if (progress[i].every((num) => num === 0)) {
        break;
      }
      progress[i + 1] = progress[i].reduce<number[]>(
        (acc, curr, index, array) => {
          if (index === array.length - 1) return acc;
          acc[index] = array[index + 1] - curr;
          return acc;
        },
        [],
      );
    }
    return progress.reduceRight((sum, nums) => nums.at(0)! - sum, 0);
  });

  return extrapolatedValues.reduce((a, b) => a + b);
};

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
