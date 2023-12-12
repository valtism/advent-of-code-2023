import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.trim());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const calibrationValues = input.map((row) => {
    const nums = row.split("").filter(isNumber);
    return `${nums.at(0)}${nums.at(-1)}`;
  });

  return calibrationValues.map(Number).reduce((a, b) => a + b);
};

function isNumber(number: unknown) {
  if (typeof number === "number") {
    return number - number === 0;
  }
  if (typeof number === "string" && number.trim() !== "") {
    return Number.isFinite(+number);
  }
  return false;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const nums = input.map((row) => {
    const first = validNumberStrings.reduce(
      (acc, numStr, numStringIndex) => {
        const idx = row.indexOf(numStr);
        if (idx < 0 || idx > acc.index) return acc;
        return { num: numStringIndex, index: idx };
      },
      { num: -1, index: Infinity },
    );
    const last = validNumberStrings.reduce(
      (acc, numStr, numStringIndex) => {
        const idx = row.lastIndexOf(numStr);
        if (idx < acc.index) return acc;
        return { num: numStringIndex, index: idx };
      },
      { num: -1, index: -Infinity },
    );
    return `${validNumberStrings[first.num % 9]}${
      validNumberStrings[last.num % 9]
    }`;
  });

  return nums.map(Number).reduce((acc, curr) => acc + curr);
};

const validNumberStrings = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

run({
  part1: {
    tests: [
      {
        input: `1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
