import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((idSum, row) => {
    const [_, game, rest] = Array.from(row.matchAll(/Game (\d+):(.+)/g))[0];

    const draws = rest.split(";");
    const allValid = draws.every((draw) => {
      const counts = {
        green: Number(/((?<green>\d+) green)/g.exec(draw)?.groups?.green) || 0,
        blue: Number(/((?<blue>\d+) blue)/g.exec(draw)?.groups?.blue) || 0,
        red: Number(/((?<red>\d+) red)/g.exec(draw)?.groups?.red) || 0,
      };
      return counts.red <= 12 && counts.green <= 13 && counts.blue <= 14;
    });
    if (!allValid) return idSum;
    return Number(game) + idSum;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((powerSum, row) => {
    const [game, rest] = row.split(":");
    const colors = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const [_, numStr, color] of rest.matchAll(/(\d+) (green|blue|red)/g)) {
      const num = Number(numStr);
      if (colors[color] < num) {
        colors[color] = num;
      }
    }
    const power = colors.red * colors.green * colors.blue;
    return powerSum + power;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
