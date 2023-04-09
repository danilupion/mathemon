import { Operation, Operator } from '../operation.js';

export enum QuizMode {
  Real = 'real',
  Practice = 'practice',
}

interface CreateAdditionRealQuizReq {
  mode: QuizMode.Real;
  operator: Operator.addition;
  digits: number;
  carrying: boolean;
}

interface CreateSubtractionRealQuizReq extends Omit<CreateAdditionRealQuizReq, 'operator'> {
  operator: Operator.subtraction;
}

interface CreateMultiplicationRealQuizReq {
  mode: QuizMode.Real;
  operator: Operator.multiplication;
  digits: number;
}

interface CreateDivisionRealQuizReq extends Omit<CreateMultiplicationRealQuizReq, 'operator'> {
  operator: Operator.division;
}

export type CreateRealQuizReq =
  | CreateAdditionRealQuizReq
  | CreateSubtractionRealQuizReq
  | CreateMultiplicationRealQuizReq
  | CreateDivisionRealQuizReq;

export interface CreateMultiplicationPracticeQuizReq {
  mode: QuizMode.Practice;
  operator: Operator.multiplication;
  operand: number;
}

export type CreatePracticeQuizReq = CreateMultiplicationPracticeQuizReq;

export type CreateQuizReq = CreateRealQuizReq | CreatePracticeQuizReq;

export type CreateQuizRes = Operation[];
