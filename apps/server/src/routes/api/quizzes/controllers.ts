import { CreateQuizRequest } from '@mathemon/common/models/api/quizzes.js';
import { Operation, Operator } from '@mathemon/common/models/operation.js';
import { RequestWithBody } from '@mathemon/turbo-server/helpers/express/route.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import config from 'config';
import { Response } from 'express';

import { randomInt } from '../../../utils/math.js';

interface CreateOperandParams {
  digits: number;
  operator: Operator;
  carrying?: boolean;
  reference?: number;
}

const quizSize = config.get<number>('quiz.size');

const createOperand = ({ operator, digits, carrying, reference }: CreateOperandParams) => {
  switch (operator) {
    case Operator.addition:
      if (reference !== undefined && carrying === false) {
        const referenceDigits = reference.toString().split('');
        const newDigits = referenceDigits.map((d) => randomInt(0, 9 - Number(d)).toString());
        return Number(newDigits.join(''));
      }

      return randomInt(0, 10 ** digits - 1);
    case Operator.subtraction:
      if (reference !== undefined && carrying === false) {
        const referenceDigits = reference.toString().split('');
        const newDigits = referenceDigits.map((d) => randomInt(0, Number(d)).toString());
        return Number(newDigits.join(''));
      }

      return randomInt(0, reference === undefined ? 10 ** digits - 1 : reference);
    case Operator.multiplication:
      return randomInt(0, 10 ** digits - 1);
  }
};

export const createQuiz = async (req: RequestWithBody<CreateQuizRequest>, res: Response) => {
  const quizList: Operation[] = [];

  for (let i = 0; i < quizSize; i++) {
    const operand1 = createOperand({ ...req.body });
    const operand2 = createOperand({
      ...req.body,
      reference: operand1,
    });

    quizList.push({ operator: req.body.operator, operands: [operand1, operand2] });
  }
  res.status(StatusCode.SuccessOK).send(quizList);
};
