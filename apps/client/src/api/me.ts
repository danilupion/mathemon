import { GetPokedexRes } from '@mathemon/common/models/api/me';
import { PageQuery } from '@mathemon/turbo-client/api/pagination';
import { getRequest, urlWithQuery } from '@mathemon/turbo-client/rest/request';

const basePath = '/api/me';

export const getPokedex = (page: number) =>
  getRequest<GetPokedexRes>(urlWithQuery<PageQuery>(`${basePath}/pokedex`, { page }));
