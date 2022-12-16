import { Pokemon as BasePokemon } from '@mathemon/common/models/pokemon';
import { getRequest } from '@mathemon/turbo-client/rest/methods';
import { ApiModel } from '@mathemon/turbo-client/rest/model';

const basePath = '/api/pokemons';

export type Pokemon = ApiModel<BasePokemon>;

export const getPokemons = () => getRequest<Pokemon[]>(basePath);
