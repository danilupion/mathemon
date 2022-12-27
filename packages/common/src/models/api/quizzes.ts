import { Operator } from '../arithmeticOperation.js';

export interface CreateQuizBody {
  operator: Operator;
  digits: number;
  carrying: boolean | undefined;
}
