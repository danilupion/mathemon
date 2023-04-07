import { Operation, Operator } from '../operation.js';

interface CreateAdditionQuizReq {
  operator: Operator.addition;
  digits: number;
  carrying: boolean;
}

interface CreateSubtractionQuizReq extends Omit<CreateAdditionQuizReq, 'operator'> {
  operator: Operator.subtraction;
}

interface CreateMultiplicationQuizReq {
  operator: Operator.multiplication;
  digits: number;
}

interface CreateDivisionQuizReq extends Omit<CreateMultiplicationQuizReq, 'operator'> {
  operator: Operator.division;
}

export type CreateRealQuizReq =
  | CreateAdditionQuizReq
  | CreateSubtractionQuizReq
  | CreateMultiplicationQuizReq
  | CreateDivisionQuizReq;

export interface CreateMultiplicationPracticeQuizReq {
  operator: Operator.multiplication;
  operand: number;
}

export type CreatePracticeQuizReq = CreateMultiplicationPracticeQuizReq;

export type CreateQuizRes = Operation[];
