import got from 'got';

import { promiseStore } from './utils.js';

interface PokeApiMove {
  id: number;
  name: string;
}

export interface Move {
  id: number;
  name: string;
}

export const getMove = promiseStore(async (id: number) => {
  const pokeMove = await got.get(`https://pokeapi.co/api/v2/move/${id}`).json<PokeApiMove>();

  return {
    id: pokeMove.id,
    name: pokeMove.name,
  } as Move;
});
