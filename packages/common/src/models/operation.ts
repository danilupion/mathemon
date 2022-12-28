export enum Operator {
  addition = '+',
  subtraction = '-',
  multiplication = 'x',
}

export type Operation = {
  operator: Operator;
  operands: [number, number];
};

export type Solution = {
  operation: Operation;
  value: number;
};

export type Evaluation = {
  solution: Solution;
  correct: boolean;
};
