import { GetPokedexRes } from '@mathemon/common/models/api/me.js';
import { Pokemon } from '@mathemon/common/models/pokemon.js';
import { PageQuery } from '@mathemon/turbo-server/api/pagination.js';
import controller, {
  RequestMaybeWithQuery,
  RequestWithFields,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { ServerErrorInternalServerError } from '@mathemon/turbo-server/helpers/httpError.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { JwtData } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import config from 'config';

import Pokedex from '../../../../models/pokedex.js';
import PokemonModel, { PokemonDocument } from '../../../../models/pokemon.js';

const pageSize = config.get<number>('settings.pokedex.pageSize');

const unknowPokemon = (pokemon: PokemonDocument): Pokemon => ({
  ...pokemon.toJSON(),
  name: '???',
  habitat: '???',
  types: ['???'],
  abilities: ['???'],
  moves: ['???'],
});

export const getPokedex = controller<
  RequestMaybeWithQuery<PageQuery, RequestWithFields<JwtData>>,
  ResponseWithBody<GetPokedexRes>
>(async (req, res) => {
  const pokedex = await Pokedex.findOne({ user: req.jwtUser.id });
  if (!pokedex) {
    throw new ServerErrorInternalServerError(new Error('Pokedex not found'));
  }

  const pokemons = await PokemonModel.inUsedGenerations()
    .sort({ number: 1 })
    .limit(pageSize)
    .skip((req.query.page !== undefined ? req.query.page - 1 : 0) * pageSize);

  res.status(StatusCode.SuccessOK).send({
    data: pokemons.map((pokemon) => {
      return pokedex.pokemons.has(pokemon.number.toString())
        ? pokemon.toJSON()
        : unknowPokemon(pokemon);
    }),
    meta: {
      total: await PokemonModel.inUsedGenerations().countDocuments().exec(),
      found: pokedex.pokemons.size,
      captured: Array.from(pokedex.pokemons.entries()).filter(([, owned]) => owned).length,
    },
  });
});
