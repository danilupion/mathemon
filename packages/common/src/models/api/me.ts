import { PaginatedResponse } from '@mathemon/turbo-common/api/pagination.js';

import { Pokemon } from '../pokemon.js';

export type PokedexFilterQuery = {
  search?: string;
};

export type PokedexMeta = {
  total: number;
  found: number;
  captured: number;
};

export type GetPokedexRes = PaginatedResponse<Pokemon, PokedexMeta>;

export type AccountRes = {
  username: string;
  email: string;
};

export type PatchAccountReq = {
  username?: string;
  email?: string;
  password?: string;
};
