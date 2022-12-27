import { CreateAssessmentBody } from '@mathemon/common/models/api/assessments.js';
import { Operator } from '@mathemon/common/models/arithmeticOperation.js';
import { ArithmeticOperationResult } from '@mathemon/common/models/arithmeticOperationResult.js';
import { RequestWithBody } from '@mathemon/turbo-server/helpers/express/route.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Response } from 'express';

const isCorrect = ({ operation: { operator, operands }, result }: ArithmeticOperationResult) => {
  let resultOfOperation;
  switch (operator) {
    case Operator.addition:
      resultOfOperation = operands[0] + operands[1];
      break;
    case Operator.subtraction:
      resultOfOperation = operands[0] - operands[1];
      break;
    case Operator.multiplication:
      resultOfOperation = operands[0] * operands[1];
      break;
  }

  return resultOfOperation === result;
};

export const createAssessment = async (
  req: RequestWithBody<CreateAssessmentBody>,
  res: Response,
) => {
  const assessment = req.body.map((result) => ({
    ...result,
    correct: isCorrect(result),
  }));
  res.status(StatusCode.SuccessOK).send(assessment);
};
