import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

const cardRegex =
  /Card\s+(?<card_num>\d+):\s+(?<winners>.+)\|\s+(?<numbers>.+)/;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // Reduce to procude sum
  return input.reduce((sum, row) => {
    // Get capture groups
    const matches = cardRegex.exec(row);
    const winnersStr = matches!.groups!.winners;
    const numbersStr = matches!.groups!.numbers;
    const winners = winnersStr.split(/\s+/g);
    const numbers = numbersStr.split(/\s+/g);
    // Filter numbers that match winning numbers
    const winnerMatches = winners.filter((num) => numbers.includes(num));
    // Raise to power of 2 for points
    const points = winnerMatches.length ? 2 ** (winnerMatches.length - 1) : 0;
    // Sum
    return sum + points;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // Map of copies of cards
  const copiesMap = [...Array(input.length).keys()].reduce((obj, num) => {
    obj[num + 1] = 1;
    return obj;
  }, {} as Record<number, number>);

  input.forEach((row) => {
    // Get capture groups
    const matches = cardRegex.exec(row);
    const cardNumber = Number(matches!.groups!.card_num);
    const winnersStr = matches!.groups!.winners;
    const numbersStr = matches!.groups!.numbers;
    const winners = winnersStr.split(/\s+/g);
    const numbers = numbersStr.split(/\s+/g);
    // Filter numbers that match winning numbers
    const winnerMatches = winners.filter((num) => numbers.includes(num));

    // How many copies to distribute to each successive card
    const currentCopies = copiesMap[cardNumber];
    for (let i = cardNumber + 1; i <= cardNumber + winnerMatches.length; i++) {
      // Note: we don't need to worry about overflows in this problem
      copiesMap[i] += currentCopies;
    }
  });

  // Add all copes
  return Object.values(copiesMap).reduce((sum, copies) => sum + copies);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
