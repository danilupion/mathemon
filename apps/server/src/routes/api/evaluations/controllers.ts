import {
  CreateEvaluationReq,
  CreateEvaluationRes,
} from '@mathemon/common/models/api/evaluations.js';
import { Operator, Solution } from '@mathemon/common/models/operation.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';

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

export const createEvaluation = controller<CreateEvaluationReq, CreateEvaluationRes>(
  async (req, res) => {
    const evaluations = req.body.map((solution) => ({
      solution,
      correct: isCorrect(solution),
    }));
    res.status(StatusCode.SuccessOK).send(evaluations);
  },
);
