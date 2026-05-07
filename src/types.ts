export type DivisionProblem = {
  id: string;
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  quotientOptions: number[];
  remainderOptions: number[];
};

export type AnswerState = 'idle' | 'correct' | 'wrong';

export type GamePhase = 'quotient' | 'remainder';
