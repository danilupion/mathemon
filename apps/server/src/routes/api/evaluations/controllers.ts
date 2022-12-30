import {
  CreateEvaluationReq,
  CreateEvaluationRes,
} from '@mathemon/common/models/api/evaluations.js';
import { Operator, Solution } from '@mathemon/common/models/operation.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';

import PokemonModel from '../../../models/pokemon.js';

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

    // TODO: Save to database and review approach
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pokemon: any;
    const correct = evaluations.filter((e) => e.correct).length;
    if (correct === evaluations.length) {
      pokemon = (await PokemonModel.aggregate([{ $sample: { size: 1 } }]))[0];
      const { _id, __v, ...rest } = pokemon;
      pokemon = rest;
    }

    res.status(StatusCode.SuccessOK).send({
      evaluations,
      score: {
        total: evaluations.length,
        correct,
      },
      reward: correct === evaluations.length ? pokemon : undefined,
    });
  },
);
