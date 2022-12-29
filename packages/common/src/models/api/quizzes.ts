import { Operation, Operator } from '../operation.js';

export interface CreateQuizReq {
  operator: Operator;
  digits: number;
  carrying: boolean | undefined;
}

export type CreateQuizRes = Operation[];
