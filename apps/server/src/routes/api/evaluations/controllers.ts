import { CreateEvaluationRequest } from '@mathemon/common/models/api/evaluations.js';
import { Operator, Solution } from '@mathemon/common/models/operation.js';
import { RequestWithBody } from '@mathemon/turbo-server/helpers/express/route.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Response } from 'express';

const isCorrect = ({ operation: { operator, operands }, value }: Solution) => {
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

  return resultOfOperation === value;
};

export const createEvaluation = async (
  req: RequestWithBody<CreateEvaluationRequest>,
  res: Response,
) => {
  const evaluations = req.body.map((result) => ({
    ...result,
    correct: isCorrect(result),
  }));
  res.status(StatusCode.SuccessOK).send(evaluations);
};
