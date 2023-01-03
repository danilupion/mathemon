import { GetPokedexRes } from '@mathemon/common/models/api/me.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { ServerErrorInternalServerError } from '@mathemon/turbo-server/helpers/httpError.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { JwtData } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import config from 'config';

import Pokedex from '../../../../models/pokedex.js';
import PokemonModel from '../../../../models/pokemon.js';

const pokemonGenerations = config.get<number[]>('settings.pokemon.generations');

export const getPokedex = controller<never, GetPokedexRes, JwtData>(async (req, res) => {
  const pokedex = await Pokedex.findOne({ user: req.jwtUser.id });
  if (!pokedex) {
    throw new ServerErrorInternalServerError(new Error('Pokedex not found'));
  }

  const pokemons = await PokemonModel.find({ generation: pokemonGenerations }).sort({ number: 1 });

  res.status(StatusCode.SuccessOK).send(
    pokemons.map((pokemon) => {
      return pokedex.pokemons.has(pokemon.number.toString())
        ? pokemon.toJSON()
        : { ...pokemon.toJSON(), name: '???', habitat: '???', types: ['???'] };
    }),
  );
});
