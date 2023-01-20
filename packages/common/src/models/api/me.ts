import { PaginatedResponse } from '@mathemon/turbo-common/api/pagination.js';

import { Operator } from '../operation.js';
import { Pokemon, PokemonType } from '../pokemon.js';

export type PokedexFilterQuery = {
  search?: string;
};

export type PokedexMeta = {
  total: number;
  found: number;
  captured: number;
};

export type PokemonRes = Omit<Pokemon, 'types'> & {
  types: (PokemonType | '???')[];
  operator: Operator;
  count: number;
};

export type GetPokedexRes = PaginatedResponse<PokemonRes, PokedexMeta>;

export type AccountRes = {
  username: string;
  email: string;
};

export type PatchAccountReq = {
  username?: string;
  email?: string;
  password?: string;
};
