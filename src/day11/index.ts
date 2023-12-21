import run from "aocrunner";

type Coord = {
  x: number;
  y: number;
};

export function* combinations<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const pool = [...iterable];
  const n = pool.length;
  if (r > n) {
    return;
  }
  const indices = new Uint32Array(r).map((_, index) => index);
  yield pool.slice(0, r);
  while (true) {
    let i: number;
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] !== i + n - r) {
          break loop;
        }
      }
      return;
    }
    const result: T[] = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }
    let index = (indices[i] += 1);
    result[i] = pool[index];
    for (let j = i + 1; j < r; j++) {
      indices[j] = index += 1;
      result[j] = pool[index];
    }
    yield result;
  }
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).map((row) => row.split(""));
  const rowIndexesForExpansion = input.reduce<number[]>(
    (rowIndexes, row, index) => {
      if (row.every((char) => char === ".")) {
        rowIndexes.push(index);
      }
      return rowIndexes;
    },
    [],
  );
  const colIndexesForExpansion = input.reduce<number[]>(
    (colIndexes, row, index, array) => {
      if (array.every((row) => row[index] === ".")) {
        colIndexes.push(index);
      }
      return colIndexes;
    },
    [],
  );

  rowIndexesForExpansion.reverse().forEach((rowIndex) => {
    input.splice(rowIndex, 0, new Array(input[0].length).fill("."));
  });

  colIndexesForExpansion.reverse().forEach((colIndex) => {
    input.forEach((row) => row.splice(colIndex, 0, "."));
  });

  const starCoords: Coord[] = [];
  input.forEach((row, yIndex) => {
    row.forEach((cell, xIndex) => {
      if (cell === "#") {
        starCoords.push({ x: xIndex, y: yIndex });
      }
    });
  });

  return [...combinations(starCoords, 2)].reduce((sum, [coord1, coord2]) => {
    const manhattanDistance =
      Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
    return sum + manhattanDistance;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map((row) => row.split(""));
  const rowIndexesForExpansion = input.reduce<number[]>(
    (rowIndexes, row, index) => {
      if (row.every((char) => char === ".")) {
        rowIndexes.push(index);
      }
      return rowIndexes;
    },
    [],
  );
  const colIndexesForExpansion = input.reduce<number[]>(
    (colIndexes, row, index, array) => {
      if (array.every((row) => row[index] === ".")) {
        colIndexes.push(index);
      }
      return colIndexes;
    },
    [],
  );

  const DISTANCE = 1000000;
  const starCoords: Coord[] = [];
  input.forEach((row, yIndex) => {
    row.forEach((cell, xIndex) => {
      if (cell === "#") {
        const extraX = colIndexesForExpansion
          .filter((i) => i < xIndex)
          .reduce((sum, i) => sum + DISTANCE - 1, 0);
        const extraY = rowIndexesForExpansion
          .filter((i) => i < yIndex)
          .reduce((sum, i) => sum + DISTANCE - 1, 0);
        starCoords.push({ x: xIndex + extraX, y: yIndex + extraY });
      }
    });
  });

  return [...combinations(starCoords, 2)].reduce((sum, [coord1, coord2]) => {
    const manhattanDistance =
      Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
    return sum + manhattanDistance;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `...#......
        .......#..
        #.........
        ..........
        ......#...
        .#........
        .........#
        ..........
        .......#..
        #...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
        .......#..
        #.........
        ..........
        ......#...
        .#........
        .........#
        ..........
        .......#..
        #...#.....`,
        expected: 82000210,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
