import { PaginatedResponse } from '@mathemon/turbo-common/api/pagination.js';

import { PokedexPokemon } from '../pokemon.js';

export type PokedexFilterQuery = {
  search?: string;
};

export type PokedexMeta = {
  total: number;
  found: number;
  captured: number;
};

export type PokedexPokemonRes = PokedexPokemon & {
  count: number;
};

export type GetPokedexRes = PaginatedResponse<PokedexPokemonRes, PokedexMeta>;

export type AccountRes = {
  username: string;
  email: string;
};

export type PatchAccountReq = {
  username?: string;
  email?: string;
  password?: string;
};
