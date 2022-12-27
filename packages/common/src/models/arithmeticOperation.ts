export enum Operator {
  addition = '+',
  subtraction = '-',
  multiplication = 'x',
}

export type ArithmeticOperation = {
  operator: Operator;
  operands: [number, number];
};
