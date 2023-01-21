import { default as got } from 'got';

import { promiseStore } from './utils.js';

interface PokeApiAbility {
  id: number;
  name: string;
}

export interface Ability {
  id: number;
  name: string;
}

export const getAbility = promiseStore(async (id: number) => {
  const pokeApiAbility = await got
    .get(`https://pokeapi.co/api/v2/ability/${id}`)
    .json<PokeApiAbility>();

  return {
    id: pokeApiAbility.id,
    name: pokeApiAbility.name,
  } as Ability;
});
