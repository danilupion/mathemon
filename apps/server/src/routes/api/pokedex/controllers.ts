import { GetPokedexRes } from '@mathemon/common/models/api/pokedex.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Request, Response } from 'express';

import PokemonModel from '../../../models/pokemon.js';

export const getAllPokemons = controller<never, GetPokedexRes>(
  async (_: Request, res: Response) => {
    res
      .status(StatusCode.SuccessOK)
      .send(
        (await PokemonModel.find().sort({ generation: 1, order: 1 })).map((pokemon) =>
          pokemon.toJSON(),
        ),
      );
  },
);
