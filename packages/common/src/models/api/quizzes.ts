import { Operation, Operator } from '../operation.js';

export interface CreateQuizRequest {
  operator: Operator;
  digits: number;
  carrying: boolean | undefined;
}

export type CreateQuizResponse = Operation[];
