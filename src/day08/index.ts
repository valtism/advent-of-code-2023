import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [instructionString, mapString] = input.split("\n\n");
  const map: Record<string, { L: string; R: string }> = {};
  mapString.split("\n").forEach((row) => {
    const [location, left, right] = [...row.match(/\w+/g)!];
    map[location] = { L: left, R: right };
  });

  const instructions = instructionString.split("") as ("L" | "R")[];
  let currentLocation = "AAA";
  let steps = 0;
  while (currentLocation !== "ZZZ") {
    const instruction = instructions[steps % instructions.length];
    currentLocation = map[currentLocation][instruction];
    steps++;
  }

  return steps;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [instructionString, mapString] = input.split("\n\n");
  const map: Record<string, { L: string; R: string }> = {};
  mapString.split("\n").forEach((row) => {
    const [location, left, right] = [...row.match(/\w+/g)!];
    map[location] = { L: left, R: right };
  });

  const instructions = instructionString.split("") as ("L" | "R")[];
  let currentLocations = Object.keys(map).filter((key) => key[2] === "A");

  // Get just the intervals (how long it takes to reach Z)
  // N.B. All intervals are the same in the problem
  const intervals: (number | null)[] = currentLocations.map((_) => null);
  let steps = 0;
  while (intervals.some((interval) => interval === null)) {
    // Get current instruction
    const instruction = instructions[steps % instructions.length];

    // Update locations for each ghost
    currentLocations = currentLocations.map((currentLocation, index) => {
      // Get new location
      const newLocation = map[currentLocation][instruction];
      // If we are at a "Z" end and don't have an interval here, add it
      if (newLocation[2] === "Z" && !intervals[index]) {
        intervals[index] = steps + 1;
      }
      return newLocation;
    });
    steps++;
  }

  // Find lowest common multiple of intervals to figure out when they will intersect
  return lcmArray(intervals as number[]);
};

// Function to calculate GCD of two numbers
function greatestCommonDenominator(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDenominator(b, a % b);
}

// Function to calculate LCM of two numbers
function lowestCommonMultiple(a: number, b: number) {
  return Math.abs(a * b) / greatestCommonDenominator(a, b);
}

// Function to calculate LCM of an array of numbers
function lcmArray(arr: number[]) {
  // Ensure the array has at least two elements
  if (arr.length < 2) {
    throw new Error("Array should have at least two elements");
  }

  // Calculate LCM iteratively
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = lowestCommonMultiple(result, arr[i]);
  }

  return result;
}

run({
  part1: {
    tests: [
      {
        input: `RL

        AAA = (BBB, CCC)
        BBB = (DDD, EEE)
        CCC = (ZZZ, GGG)
        DDD = (DDD, DDD)
        EEE = (EEE, EEE)
        GGG = (GGG, GGG)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `LR
      //   11A = (11B, XXX)
      //   11B = (XXX, 11Z)
      //   11Z = (11B, XXX)
      //   22A = (22B, XXX)
      //   22B = (22C, 22C)
      //   22C = (22Z, 22Z)
      //   22Z = (22B, 22B)
      //   XXX = (XXX, XXX)`,
      //   expected: 6,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
