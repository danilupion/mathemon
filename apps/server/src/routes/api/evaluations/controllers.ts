import {
  CreateEvaluationReq,
  CreateEvaluationRes,
} from '@mathemon/common/models/api/evaluations.js';
import { Operator, Solution } from '@mathemon/common/models/operation.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { JwtData } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import config from 'config';

import PokedexModel from '../../../models/pokedex.js';
import PokemonModel, { PokemonDocument } from '../../../models/pokemon.js';

const pokemonGenerations = config.get<number[]>('settings.pokemon.generations');

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
    case Operator.division:
      resultOfOperation = operands[0] / operands[1];
      break;
  }

  return resultOfOperation === value;
};

const getPokemon = (pokemon: PokemonDocument) => {
  const { _id, __v, ...rest } = pokemon;
  return { id: _id, ...rest };
};

export const createEvaluation = controller<
  RequestWithBody<CreateEvaluationReq, RequestWithFields<JwtData>>,
  ResponseWithBody<CreateEvaluationRes>
>(async (req, res) => {
  const evaluations = req.body.map((solution) => ({
    solution,
    correct: isCorrect(solution),
  }));

  let pokemon: PokemonDocument | undefined = undefined;

  const correct = evaluations.filter((e) => e.correct).length;
  if (correct === evaluations.length) {
    pokemon = (
      await PokemonModel.aggregate([
        { $match: { $expr: { $in: ['$generation', pokemonGenerations] } } },
        { $sample: { size: 1 } },
      ])
    )[0];
  }

  if (pokemon && req.jwtUser) {
    let pokedex = await PokedexModel.findOne({ user: req.jwtUser.id });
    if (!pokedex) {
      pokedex = new PokedexModel({ user: req.jwtUser.id });
    }

    const pokedexEntry = pokedex.pokemons.has(pokemon.number.toString())
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pokedex.pokemons.get(pokemon.number.toString())!
      : { count: 0 };

    pokedexEntry.count += 1;

    pokedex.pokemons.set(pokemon.number.toString(), pokedexEntry);
    await pokedex.save();
  }

  res.status(StatusCode.SuccessOK).send({
    evaluations,
    score: {
      total: evaluations.length,
      correct,
    },
    reward: pokemon ? getPokemon(pokemon) : undefined,
  });
});
