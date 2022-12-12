import got from 'got';

export interface PokemonSpecie {
  name: string;
  url: string;
}
export interface PokemomGenerationResponse {
  pokemon_species: PokemonSpecie[];
}
export const getGeneration = async (generation: number) => {
  const response = await got
    .get(`https://pokeapi.co/api/v2/generation/${generation}`)
    .json<PokemomGenerationResponse>();
  return response.pokemon_species;
};
