import got from 'got';

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
  const pokeAbility = await got
    .get(`https://pokeapi.co/api/v2/ability/${id}`)
    .json<PokeApiAbility>();

  return {
    id: pokeAbility.id,
    name: pokeAbility.name,
  } as Ability;
});
