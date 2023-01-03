import { GetPokedexRes } from '@mathemon/common/models/api/me';
import { getRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/me';

export const getPokedex = () => getRequest<GetPokedexRes>(`${basePath}/pokedex`);
