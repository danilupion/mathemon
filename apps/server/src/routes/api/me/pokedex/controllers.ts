import { PageQuery } from '@danilupion/turbo-server/api/pagination.js';
import controller, {
  RequestMaybeWithQuery,
  RequestWithFields,
  ResponseWithBody,
} from '@danilupion/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@danilupion/turbo-server/http.js';
import { UserData } from '@danilupion/turbo-server/middleware/express/auth/user.js';
import { GetPokedexRes, PokedexFilterQuery } from '@mathemon/common/models/api/me.js';
import config from 'config';

import Pokedex, { PokedexDocument } from '../../../../models/pokedex.js';
import PokemonModel from '../../../../models/pokemon.js';
import { UserDocument } from '../../../../models/user.js';

const pageSize = config.get<number>('settings.pokedex.pageSize');

const buildPokemonQuery = (pokedexPokemons: PokedexDocument['pokemons'], search?: string) => {
  return search
    ? PokemonModel.find({
        name: { $regex: search, $options: 'i' },
        number: { $in: [...pokedexPokemons.keys()] },
      })
    : PokemonModel.inUsedGenerations();
};

export const getPokedex = controller<
  RequestMaybeWithQuery<PageQuery & PokedexFilterQuery, RequestWithFields<UserData<UserDocument>>>,
  ResponseWithBody<GetPokedexRes>
>(async (req, res) => {
  const pokedex = await Pokedex.findOne({ user: req.user._id });

  const pokedexPokemons = pokedex && pokedex.pokemons ? pokedex.pokemons : new Map();

  const page = req.query.page !== undefined ? req.query.page - 1 : 0;

  const [pokemons, total] = await Promise.all([
    buildPokemonQuery(pokedexPokemons, req.query.search)
      .sort({ number: 1 })
      .limit(pageSize)
      .skip(page * pageSize),
    PokemonModel.inUsedGenerations().countDocuments(),
  ]);

  return res.status(StatusCode.SuccessOK).send({
    data: pokemons.map((pokemon) => {
      return pokedexPokemons.has(pokemon.number.toString())
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pokedexPokemons.get(pokemon.number.toString())!.count === 0
          ? { ...pokemon.toPokedexFound(), count: 0 }
          : {
              ...pokemon.toPokedexCaptured(),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              count: pokedexPokemons.get(pokemon.number.toString())!.count,
            }
        : { ...pokemon.toPokedexUnknown(), count: 0 };
    }),
    meta: {
      total,
      found: pokedexPokemons.size,
      captured: Array.from(pokedexPokemons.entries()).filter(([, { count }]) => count).length,
    },
  });
});
