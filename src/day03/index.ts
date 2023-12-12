import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((sum, row, rowIndex) => {
    // Iterate all numbers in each row
    for (const match of row.matchAll(/\d+/g)) {
      const numberStr = match[0];
      if (match.index === undefined) {
        // Should not happen
        throw new Error("No index");
      }
      // Get array of coordinates surrounding number
      const surroundCoords = getSurroundingCoords(
        { x: match.index, y: rowIndex },
        numberStr.length,
      );
      // Is symbol in surrounding cells?
      const isNearSymbol = surroundCoords.some((coord) => {
        const item = input[coord.y]?.[coord.x];
        const isItemSymbol = item !== undefined && /[^\d^\.]/g.test(item);
        return isItemSymbol;
      });
      if (isNearSymbol) {
        // Add to sum if near a symbol
        sum += Number(numberStr);
      }
    }
    return sum;
  }, 0);
};

type Point = { x: number; y: number };
function getSurroundingCoords(coords: Point, length: number) {
  const surroundingCoords: Point[] = [];
  for (let y = coords.y - 1; y <= coords.y + 1; y++) {
    for (let x = coords.x - 1; x <= coords.x + length; x++) {
      surroundingCoords.push({ x, y });
    }
  }
  return surroundingCoords;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // Map of coordinates of * symbols, with array of touching numbers
  const starMap = new Map<string, number[]>();

  input.forEach((row, rowIndex) => {
    // Iterate all numbers in each row
    for (const match of row.matchAll(/\d+/g)) {
      const numberStr = match[0];
      if (match.index === undefined) {
        // Should not happen
        throw new Error("No index");
      }
      // Get array of coordinates surrounding number
      const surroundCoords = getSurroundingCoords(
        { x: match.index, y: rowIndex },
        numberStr.length,
      );
      // Check surrounding coords for * symbol
      surroundCoords.forEach((coord) => {
        const item = input[coord.y]?.[coord.x];
        if (item === "*") {
          // Found * symbol. Add number to array of numbers touching it
          const coordString = `${coord.y},${coord.x}`;
          const existingNums = starMap.get(coordString) || [];
          starMap.set(coordString, [...existingNums, Number(numberStr)]);
        }
        const isItemSymbol = item !== undefined && /[^\d^\.]/g.test(item);
        return isItemSymbol;
      });
    }
  });

  return (
    [...starMap.values()]
      // Only touches 2 numbers
      .filter((nums) => nums.length === 2)
      // Multiply numbers to get ratio
      .map((nums) => nums.reduce((a, b) => a * b))
      // Sum ratios
      .reduce((sum, ratio) => sum + ratio)
  );
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 4361,
      },
      {
        input: `...12
        12*..`,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
