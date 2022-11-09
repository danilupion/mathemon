export enum Operator {
  addition = '+',
  subtraction = '-',
  multiplication = 'x',
}

const numberOfDigits = (candidate: number) => candidate.toString().length;

export default class ArithmeticOperation {
  constructor(public readonly operator: Operator, public readonly operands: [number, number]) {}

  public maxDigits = () => Math.max(...this.operands.map(numberOfDigits));

  public result = () => {
    switch (this.operator) {
      case Operator.addition:
        return this.operands[0] + this.operands[1];
      case Operator.subtraction:
        return this.operands[0] - this.operands[1];
      case Operator.multiplication:
        return this.operands[0] * this.operands[1];
    }
  };
}
