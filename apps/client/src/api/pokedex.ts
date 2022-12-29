import { GetPokedexRes } from '@mathemon/common/models/api/pokedex';
import { getRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/pokedex';

export const getPokedex = () => getRequest<GetPokedexRes>(basePath);
