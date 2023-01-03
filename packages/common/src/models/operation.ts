export enum Operator {
  addition = '+',
  subtraction = '-',
  multiplication = 'x',
  division = '÷',
}

export type Operation = {
  operator: Operator;
  operands: [number, number];
};

export type Solution = {
  operation: Operation;
  value: number;
};

export type Score = {
  total: number;
  correct: number;
};

export type Evaluation = {
  solution: Solution;
  correct: boolean;
};
