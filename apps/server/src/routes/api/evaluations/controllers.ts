import {
  CreateEvaluationReq,
  CreateEvaluationRes,
} from '@mathemon/common/models/api/evaluations.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { ServerErrorInternalServerError } from '@mathemon/turbo-server/helpers/httpError.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { JwtData } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import config from 'config';
import { ObjectId } from 'mongoose';

import PokedexModel from '../../../models/pokedex.js';
import PokemonModel from '../../../models/pokemon.js';
import { isCorrect } from '../../../utils/operation.js';
import { getTypesForOperator } from '../../../utils/pokemon.js';

const pokemonGenerations = config.get<number[]>('settings.pokemon.generations');

export const createEvaluation = controller<
  RequestWithBody<CreateEvaluationReq, RequestWithFields<JwtData>>,
  ResponseWithBody<CreateEvaluationRes>
>(async (req, res) => {
  const operator = req.body[0].operation.operator;
  const evaluations = req.body.map((solution) => ({
    solution,
    correct: isCorrect(solution),
  }));

  const correct = evaluations.filter((e) => e.correct).length;
  const success = correct === req.body.length;

  const pokemon =
    (await PokemonModel.findById(
      (
        await PokemonModel.aggregate<{ _id: ObjectId }>([
          {
            $match: {
              $and: [
                { generation: { $in: pokemonGenerations } },
                { 'types.0': { $in: getTypesForOperator(operator) } },
              ],
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
          { $sample: { size: 1 } },
        ])
      )[0]._id,
    ).exec()) || undefined;

  if (!pokemon) {
    throw new ServerErrorInternalServerError(new Error('No pokemon found'));
  }

  if (req.jwtUser) {
    let pokedex = await PokedexModel.findOne({ user: req.jwtUser.id });
    if (!pokedex) {
      pokedex = new PokedexModel({ user: req.jwtUser.id });
    }

    const pokedexEntry = pokedex.pokemons.has(pokemon.number.toString())
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pokedex.pokemons.get(pokemon.number.toString())!
      : { count: 0 };

    if (success) {
      pokedexEntry.count += 1;
    }

    pokedex.pokemons.set(pokemon.number.toString(), pokedexEntry);
    await pokedex.save();
  }

  return res.status(StatusCode.SuccessOK).send({
    evaluations,
    score: {
      total: evaluations.length,
      correct,
    },
    success,
    reward: pokemon.normalize(),
  });
});
