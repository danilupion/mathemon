import { default as got } from 'got';

import { getUrlId, promiseStore } from './utils.js';

interface EvolutionLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionLink[];
}

interface PokeApiEvolutionChain {
  id: number;
  chain: EvolutionLink;
}

interface Species {
  id: number;
  name: string;
}

export interface EvolutionChain {
  id: number;
  chain: Species[][];
}

export const getEvolutionChain = promiseStore(async (id: number) => {
  const pokeApiEvolutionChain = await got
    .get(`https://pokeapi.co/api/v2/evolution-chain/${id}`)
    .json<PokeApiEvolutionChain>();

  const chain: Species[][] = [];

  const crawl = (evolutionLink: EvolutionLink, level = 0) => {
    if (chain.length < level + 1) {
      chain.push([]);
    }
    const element = chain[level];
    element.push({ id: getUrlId(evolutionLink.species.url), name: evolutionLink.species.name });

    evolutionLink.evolves_to.forEach((evolutionLink) => {
      crawl(evolutionLink, level + 1);
    });
  };

  crawl(pokeApiEvolutionChain.chain);

  return {
    id: pokeApiEvolutionChain.id,
    chain: chain,
  } as EvolutionChain;
});
