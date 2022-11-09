import { makeAutoObservable } from 'mobx';

import ArithmeticOperation, { Operator } from '../models/ArithmeticOperation';
import { randomInt } from '../utils/math';
import { loadSectionSettings } from '../utils/settingsManager';

export type QuizResult = number | undefined;

export type Review = boolean | undefined;

interface CreateOperandParams {
  maxDigits: number;
  operator: Operator;
  carrying?: boolean;
  reference?: number;
}

const createOperand = ({ operator, maxDigits, carrying, reference }: CreateOperandParams) => {
  switch (operator) {
    case Operator.addition:
      if (reference !== undefined && carrying === false) {
        const referenceDigits = reference.toString().split('');
        const newDigits = referenceDigits.map((d) => randomInt(0, 9 - Number(d)).toString());
        return Number(newDigits.join(''));
      }

      return randomInt(0, 10 ** maxDigits - 1);
    case Operator.subtraction:
      if (reference !== undefined && carrying === false) {
        const referenceDigits = reference.toString().split('');
        const newDigits = referenceDigits.map((d) => randomInt(0, Number(d)).toString());
        return Number(newDigits.join(''));
      }

      return randomInt(0, reference === undefined ? 10 ** maxDigits - 1 : reference);
    case Operator.multiplication:
      return randomInt(0, 10 ** maxDigits - 1);
  }
};

const quizSize = 20;

export class QuizStore {
  private quizList: ArithmeticOperation[] = [];
  private resultList: QuizResult[] = [];
  private reviewsList: Review[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public generateQuiz(operator: Operator) {
    const { digits, carrying } = loadSectionSettings(operator);
    this.quizList.splice(0, this.quizList.length);
    this.resultList.splice(0, this.resultList.length);
    this.reviewsList.splice(0, this.reviewsList.length);

    for (let i = 0; i < quizSize; i++) {
      const operand1 = createOperand({ maxDigits: digits, operator, carrying });
      const operand2 = createOperand({
        maxDigits: digits,
        operator,
        carrying,
        reference: operand1,
      });

      this.quizList.push(new ArithmeticOperation(operator, [operand1, operand2]));
      this.resultList.push(undefined);
      this.reviewsList.push(undefined);
    }
  }

  public review = () => {
    this.reviewsList.splice(0, this.reviewsList.length);

    this.reviewsList.push(
      ...this.quizList.map((operation, index) => this.resultList[index] === operation.result()),
    );
  };

  public setResult(index: number, value: QuizResult) {
    if (index <= this.resultList.length) {
      this.resultList[index] = value;
    }
  }

  public get quizItems() {
    return [...this.quizList];
  }

  public getResult(index: number) {
    return this.resultList[index];
  }

  public getReview(index: number) {
    return this.reviewsList[index];
  }
}

export const quizStore = new QuizStore();
