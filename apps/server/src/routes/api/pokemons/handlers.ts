import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Request, Response } from 'express';

import PokemonModel from '../../../models/pokemon.js';

export const getAllPokemons = async (_: Request, res: Response) => {
  res
    .status(StatusCode.SuccessOK)
    .send(await PokemonModel.find().sort({ generation: 1, order: 1 }));
};
