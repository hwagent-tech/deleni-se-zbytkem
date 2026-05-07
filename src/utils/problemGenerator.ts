import type { DivisionProblem } from '../types';

const MIN_DIVISOR = 4;
const MAX_DIVISOR = 10;
const MAX_DIVIDEND = 100;
const MAX_QUOTIENT = 10;

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

const uniqueByPriority = (candidates: number[], correct: number, isAllowed: (value: number) => boolean) => {
  const options = [correct];

  for (const candidate of candidates) {
    if (options.length === 4) {
      break;
    }

    if (candidate !== correct && isAllowed(candidate) && !options.includes(candidate)) {
      options.push(candidate);
    }
  }

  return options;
};

const closeNumbers = (correct: number, min: number, max: number) => {
  const candidates: number[] = [];

  for (let distance = 1; candidates.length < 12 && distance <= 12; distance += 1) {
    candidates.push(correct - distance, correct + distance);
  }

  return candidates.filter((value) => value >= min && value <= max);
};

const buildQuotientOptions = (correct: number, divisor: number, dividend: number) => {
  const roundedUp = Math.ceil(dividend / divisor);
  const offByDividend = Math.max(1, Math.round((dividend + 1) / divisor));
  const candidates = [
    correct - 1,
    correct + 1,
    roundedUp,
    correct + 2,
    correct - 2,
    offByDividend,
    ...closeNumbers(correct, 1, MAX_QUOTIENT),
  ];

  return shuffle(
    uniqueByPriority(
      candidates,
      correct,
      (value) => Number.isInteger(value) && value >= 1 && value <= MAX_QUOTIENT,
    ),
  );
};

const buildRemainderOptions = (correct: number, divisor: number) => {
  const validRemainders = Array.from({ length: divisor }, (_, index) => index);
  const candidates = [
    correct - 1,
    correct + 1,
    correct - 2,
    correct + 2,
    divisor - correct,
    Math.abs(correct - divisor),
    ...validRemainders.sort((a, b) => Math.abs(a - correct) - Math.abs(b - correct)),
  ];

  return shuffle(uniqueByPriority(candidates, correct, (value) => value >= 0 && value < divisor));
};

export const generateProblem = (): DivisionProblem => {
  const divisor = randomInt(MIN_DIVISOR, MAX_DIVISOR);
  const quotient = randomInt(1, Math.min(MAX_QUOTIENT, Math.floor(MAX_DIVIDEND / divisor)));
  const maxRemainder = Math.min(divisor - 1, MAX_DIVIDEND - quotient * divisor);
  const shouldBeExact = Math.random() < 0.35 || maxRemainder === 0;
  const remainder = shouldBeExact ? 0 : randomInt(1, maxRemainder);
  const dividend = quotient * divisor + remainder;

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dividend,
    divisor,
    quotient,
    remainder,
    quotientOptions: buildQuotientOptions(quotient, divisor, dividend),
    remainderOptions: buildRemainderOptions(remainder, divisor),
  };
};
