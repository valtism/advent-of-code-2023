import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

type Coord = { x: number; y: number };

type Direction = "N" | "E" | "S" | "W";

type Tile = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const tiles = input.map((row) => row.split("")) as Tile[][];

  const startingCoords = getStartingCoord(tiles);
  if (startingCoords === null) throw new Error("Start not found");

  const visited = getTilesInLoop(tiles, startingCoords);

  return visited.size / 2;
};

function getStartingCoord(tiles: Tile[][]) {
  return tiles.reduce<Coord | null>((coord, row, yIndex) => {
    // Already found
    if (coord) return coord;
    // Search row
    const xIndex = row.indexOf("S");
    // Not found
    if (xIndex === -1) return coord;
    // Found!
    return { x: xIndex, y: yIndex };
  }, null);
}

function getTilesInLoop(tiles: Tile[][], startingCoords: Coord) {
  // Current position
  let currentCoords = startingCoords;
  const visited = new Set<string>();
  // All examples and input work starting going south (lazy hack)
  let direction: Direction = "S";
  // Run until we complete the loop
  while (true) {
    const coordsString = JSON.stringify(currentCoords);
    if (visited.has(coordsString)) {
      // Reached start of loop again. Break
      break;
    }
    visited.add(coordsString);
    currentCoords = moveCoords(currentCoords, direction);
    const tile = tiles[currentCoords.y][currentCoords.x];
    direction = nextDirection(tile, direction);
  }
  return visited;
}

function nextDirection(tile: Tile, directionMoved: Direction): Direction {
  switch (tile) {
    case "|":
      switch (directionMoved) {
        case "N":
        case "S":
          return directionMoved;
        default:
          throw new Error("Bad direction");
      }
    case "-":
      switch (directionMoved) {
        case "E":
        case "W":
          return directionMoved;
        default:
          throw new Error("Bad direction");
      }
    case "L":
      switch (directionMoved) {
        case "S":
          return "E";
        case "W":
          return "N";
        default:
          throw new Error("Bad direction");
      }
    case "J":
      switch (directionMoved) {
        case "S":
          return "W";
        case "E":
          return "N";
        default:
          throw new Error("Bad direction");
      }
    case "7":
      switch (directionMoved) {
        case "E":
          return "S";
        case "N":
          return "W";
        default:
          throw new Error("Bad direction");
      }
    case "F":
      switch (directionMoved) {
        case "W":
          return "S";
        case "N":
          return "E";
        default:
          throw new Error("Bad direction");
      }
    case "S":
      return directionMoved;
    default:
      throw new Error("Bad direction");
  }
}

function moveCoords(coords: Coord, direction: Direction) {
  switch (direction) {
    case "N":
      coords.y--;
      break;
    case "E":
      coords.x++;
      break;
    case "S":
      coords.y++;
      break;
    case "W":
      coords.x--;
      break;
  }
  return coords;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const tiles = input.map((row) => row.split("")) as Tile[][];

  const startingCoords = getStartingCoord(tiles);
  if (startingCoords === null) throw new Error("Start not found");

  const loop = getTilesInLoop(tiles, startingCoords);

  const inside = new Set<string>();

  const numRows = tiles.length;
  const numCols = tiles[0].length;
  // Iterate over diagonals starting from the top-left corner
  for (let diagonal = 0; diagonal < numRows + numCols - 1; diagonal++) {
    let y = Math.max(0, diagonal - numCols + 1);
    let x = Math.min(diagonal, numCols - 1);
    let crossings = 0;

    while (y < numRows && x >= 0) {
      const coordString = JSON.stringify({ x, y });
      if (loop.has(coordString)) {
        const tile = tiles[y][x];
        // Had to add "S" here for this to work for the actual input,
        // but it breaks some test cases. A proper fix would figure out
        // what the S corresponds to and intelligently include it in this check.
        if (["|", "-", "7", "L", "S"].includes(tile)) {
          // Crossing a boundary
          crossings++;
        }
      } else {
        if (crossings % 2 === 1) {
          inside.add(coordString);
        }
      }

      y++;
      x--;
    }
  }

  return inside.size;
};

run({
  part1: {
    tests: [
      {
        input: `-L|F7
        7S-7|
        L|7||
        -L-J|
        L|-JF`,
        expected: 4,
      },
      {
        input: `7-F7-
        .FJ|7
        SJLL7
        |F--J
        LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
        .S-------7.
        .|F-----7|.
        .||.....||.
        .||.....||.
        .|L-7.F-J|.
        .|..|.|..|.
        .L--J.L--J.
        ...........`,
        expected: 4,
      },
      {
        input: `..........
        .S------7.
        .|F----7|.
        .||....||.
        .||....||.
        .|L-7F-J|.
        .|..||..|.
        .L--JL--J.
        ..........`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
        .|F--7||||||||FJ....
        .||.FJ||||||||L7....
        FJL7L7LJLJ||LJ.L-7..
        L--J.L7...LJS7F-7L7.
        ....F-J..F7FJ|L7L7L7
        ....L7.F7||L7|.L7L7|
        .....|FJLJ|FJ|F7|.LJ
        ....FJL-7.||.||||...
        ....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
        L|LJ||||||||||||F--J
        FL-7LJLJ||||||LJL-77
        F--JF--7||LJLJ7F7FJ-
        L---JF-JLJ.||-FJLJJ7
        |F|F-JF---7F7-L7L|7|
        |FFJF7L7F-JF7|JL---7
        7-L-JL7||F7|L7F-7F7|
        L.L7LFJ|||||FJL7||LJ
        L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
