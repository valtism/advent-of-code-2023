import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.trim());

const HandType = {
  FiveOfAKind: 6,
  FourOfAKind: 5,
  FullHouse: 4,
  ThreeOfAKind: 3,
  TwoPair: 2,
  OnePair: 1,
  HighCard: 0,
} as const;

const Card = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  9: 7,
  8: 6,
  7: 5,
  6: 4,
  5: 3,
  4: 2,
  3: 1,
  2: 0,
} as const;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const handValues = input.map((row) => {
    const [hand, bid] = row.split(" ");
    const cards = hand.split("") as (keyof typeof Card)[];
    const countMap = cards.reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr]++;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {} as Record<keyof typeof Card, number>);
    const counts = Object.values(countMap).sort((a, b) => b - a);
    let handType: (typeof HandType)[keyof typeof HandType];
    if (counts[0] === 5) {
      handType = HandType.FiveOfAKind;
    } else if (counts[0] === 4) {
      handType = HandType.FourOfAKind;
    } else if (counts[0] === 3) {
      handType = counts[1] === 2 ? HandType.FullHouse : HandType.ThreeOfAKind;
    } else if (counts[0] === 2) {
      handType = counts[1] === 2 ? HandType.TwoPair : HandType.OnePair;
    } else {
      handType = HandType.HighCard;
    }

    // Values
    const cardValues = cards.map((card) => Card[card]);

    return {
      hand,
      handType,
      cardValues,
      bid: Number(bid),
    };
  });

  handValues.sort((a, b) => {
    if (a.handType !== b.handType) {
      return a.handType - b.handType;
    }
    for (let i = 0; i < a.cardValues.length; i++) {
      if (a.cardValues[i] !== b.cardValues[i]) {
        return a.cardValues[i] - b.cardValues[i];
      }
    }
    return 0;
  });

  return handValues.reduce((winnings, handValue, index) => {
    return winnings + handValue.bid * (index + 1);
  }, 0);
};

const Card2 = {
  A: 12,
  K: 11,
  Q: 10,
  T: 9,
  9: 8,
  8: 7,
  7: 6,
  6: 5,
  5: 4,
  4: 3,
  3: 2,
  2: 1,
  J: 0,
} as const;

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const handValues = input.map((row) => {
    const [hand, bid] = row.split(" ");
    const cards = hand.split("") as (keyof typeof Card2)[];

    // Get counts for each type
    const countMap = cards.reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr]++;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {} as Record<keyof typeof Card2, number>);

    // Extract number of Jacks and remove from count
    const jackCount = countMap["J"];
    countMap["J"] = 0;
    // Sort counts
    const counts = Object.values(countMap).sort((a, b) => b - a);
    // Distribjte to highest count
    counts[0] += jackCount || 0;
    let handType: (typeof HandType)[keyof typeof HandType];
    if (counts[0] === 5) {
      handType = HandType.FiveOfAKind;
    } else if (counts[0] === 4) {
      handType = HandType.FourOfAKind;
    } else if (counts[0] === 3) {
      handType = counts[1] === 2 ? HandType.FullHouse : HandType.ThreeOfAKind;
    } else if (counts[0] === 2) {
      handType = counts[1] === 2 ? HandType.TwoPair : HandType.OnePair;
    } else {
      handType = HandType.HighCard;
    }

    // Values
    const cardValues = cards.map((card) => Card2[card]);

    return {
      hand,
      handType,
      cardValues,
      bid: Number(bid),
    };
  });

  handValues.sort((a, b) => {
    if (a.handType !== b.handType) {
      return a.handType - b.handType;
    }
    for (let i = 0; i < a.cardValues.length; i++) {
      if (a.cardValues[i] !== b.cardValues[i]) {
        return a.cardValues[i] - b.cardValues[i];
      }
    }
    return 0;
  });

  return handValues.reduce((winnings, handValue, index) => {
    return winnings + handValue.bid * (index + 1);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
        `,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
        `,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
