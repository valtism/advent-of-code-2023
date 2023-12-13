import run from "aocrunner";

type FoodMap = {
  destination: number;
  source: number;
  range: number;
};
type Input2 = {
  seeds: number[];
  seedToSoil: FoodMap[];
  soilToFertilizer: FoodMap[];
  fertilizerToWater: FoodMap[];
  waterToLight: FoodMap[];
  lightToTemperature: FoodMap[];
  temperatureToHumidity: FoodMap[];
  humidityToLocation: FoodMap[];
};
type InputMap = {
  seeds: number[];
  transformations: ((input: number) => number)[];
};

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .split("\n\n")
    .map((segment) => segment.split("\n"));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const inputMap = input.reduce<InputMap>(
    (inputMap, segment, index) => {
      if (index === 0) {
        inputMap.seeds = [...segment[0].matchAll(/\d+/g)].map((item) =>
          Number(item[0]),
        );
      } else {
        const nums = segment
          // Remove title
          .slice(1)
          // Map to FoodMap
          .map((line) =>
            line.split(" ").reduce((foodMap, digit, index) => {
              switch (index) {
                case 0:
                  foodMap.destination = Number(digit);
                  break;
                case 1:
                  foodMap.source = Number(digit);
                  break;
                case 2:
                  foodMap.range = Number(digit);
                  break;
                default:
                  throw new Error("Too many cases");
              }
              return foodMap;
            }, {} as FoodMap),
          )
          // Sort by source
          .sort((a, b) => a.source - b.source);

        // Create transormation function
        const transform = (input: number) => {
          // Get transformer for range that applies to input
          const transformer = nums.reduce<FoodMap | null>((acc, curr) => {
            const source = curr.source;
            if (source > input) return acc;
            return curr;
          }, null);

          // Below range
          if (transformer === null) return input;

          const { destination, source, range } = transformer;

          // Above range
          if (source + range < input) {
            return input;
          }

          const diff = destination - source;
          return input + diff;
        };

        // Add transform to list of transformations
        inputMap.transformations.push(transform);
      }
      return inputMap;
    },
    { seeds: [], transformations: [] },
  );

  // Apply transformations to each seed to find distance
  const distances = inputMap.seeds.map((seed) =>
    inputMap.transformations.reduce((value, transform) => {
      return transform(value);
    }, seed),
  );

  // Return minimum distance
  return distances.reduce((min, curr) => (curr < min ? curr : min));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const inputMap = input.reduce<InputMap>(
    (inputMap, segment, index) => {
      if (index === 0) {
        inputMap.seeds = [...segment[0].matchAll(/\d+/g)].map((item) =>
          Number(item[0]),
        );
      } else {
        const nums = segment
          // Remove title
          .slice(1)
          // Map to FoodMap
          .map((line) =>
            line.split(" ").reduce((foodMap, digit, index) => {
              switch (index) {
                case 0:
                  foodMap.destination = Number(digit);
                  break;
                case 1:
                  foodMap.source = Number(digit);
                  break;
                case 2:
                  foodMap.range = Number(digit);
                  break;
                default:
                  throw new Error("Too many cases");
              }
              return foodMap;
            }, {} as FoodMap),
          )
          // Sort by source
          .sort((a, b) => a.source - b.source);

        // Create transormation function
        const transform = (input: number) => {
          // Get transformer for range that applies to input
          const transformer = nums.reduce<FoodMap | null>((acc, curr) => {
            const source = curr.source;
            if (source > input) return acc;
            return curr;
          }, null);

          // Below range
          if (transformer === null) return input;

          const { destination, source, range } = transformer;

          // Above range
          if (source + range < input) {
            return input;
          }

          const diff = destination - source;
          return input + diff;
        };

        // Add transform to list of transformations
        inputMap.transformations.push(transform);
      }
      return inputMap;
    },
    { seeds: [], transformations: [] },
  );

  // Apply transformations to each seed to find distance
  return inputMap.seeds.reduce<number>((acc, num, index, array) => {
    if (index % 2 !== 0) return acc;
    // Brute force. Should be calculated by slicing up ranges by start and end
    // but I'm too tired to fix the code so this will do (15m runtime on my computer)
    for (let seed = num; seed < num + array[index + 1]; seed++) {
      const destination = inputMap.transformations.reduce(
        (value, transform) => {
          return transform(value);
        },
        seed,
      );
      if (destination < acc) {
        acc = destination;
      }
    }
    return acc;
  }, Infinity);
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
