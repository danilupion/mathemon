import { GetPokedexRes, PokedexFilterQuery } from '@mathemon/common/models/api/me.js';
import { PageQuery } from '@mathemon/turbo-server/api/pagination.js';
import controller, {
  RequestMaybeWithQuery,
  RequestWithFields,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { UserData } from '@mathemon/turbo-server/middleware/express/auth/user.js';
import config from 'config';

import Pokedex, { PokedexDocument } from '../../../../models/pokedex.js';
import PokemonModel from '../../../../models/pokemon.js';
import { UserDocument } from '../../../../models/user.js';
import { getOperatorForType } from '../../../../utils/pokemon.js';

const pageSize = config.get<number>('settings.pokedex.pageSize');

export const getPokedex = controller<
  RequestMaybeWithQuery<PageQuery & PokedexFilterQuery, RequestWithFields<UserData<UserDocument>>>,
  ResponseWithBody<GetPokedexRes>
>(async (req, res) => {
  const pokedex = await Pokedex.findOne({ user: req.user._id });

  const pokedexPokemons =
    pokedex && pokedex.pokemons ? pokedex.pokemons : (new Map() as PokedexDocument['pokemons']);

  const pokemonsQuery = req.query.search
    ? PokemonModel.find({
        name: { $regex: req.query.search, $options: 'i' },
        number: { $in: [...pokedexPokemons.keys()] },
      })
    : PokemonModel.inUsedGenerations();

  const pokemons = await pokemonsQuery
    .sort({ number: 1 })
    .limit(pageSize)
    .skip((req.query.page !== undefined ? req.query.page - 1 : 0) * pageSize);

  return res.status(StatusCode.SuccessOK).send({
    data: pokemons.map((pokemon) => {
      return pokedexPokemons.has(pokemon.number.toString())
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pokedexPokemons.get(pokemon.number.toString())!.count === 0
          ? { ...pokemon.toFound(), count: 0 }
          : {
              ...pokemon.toJSON(),
              operator: getOperatorForType(pokemon.types[0]),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              count: pokedexPokemons.get(pokemon.number.toString())!.count,
            }
        : { ...pokemon.toUnknown(), count: 0 };
    }),
    meta: {
      total: await PokemonModel.inUsedGenerations().countDocuments().exec(),
      found: pokedexPokemons.size,
      captured: Array.from(pokedexPokemons.entries()).filter(([, { count }]) => count).length,
    },
  });
});
