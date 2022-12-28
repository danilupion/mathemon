import { Operator } from '../operation.js';

export interface CreateQuizBody {
  operator: Operator;
  digits: number;
  carrying: boolean | undefined;
}
