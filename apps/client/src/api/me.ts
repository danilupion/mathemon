import { PageQuery } from '@danilupion/turbo-client/api/pagination';
import { getRequest, patchRequest, urlWithQuery } from '@danilupion/turbo-client/rest/request';
import {
  AccountRes,
  GetPokedexRes,
  PatchAccountReq,
  PokedexFilterQuery,
} from '@mathemon/common/models/api/me';

const basePath = '/api/me';

export const getPokedex = (page: number, search: string) =>
  getRequest<GetPokedexRes>(
    urlWithQuery<PageQuery & PokedexFilterQuery>(`${basePath}/pokedex`, { page, search }),
  );

export const getAccount = () => getRequest<AccountRes>(`${basePath}/account`);

export const updateAccount = (username: string, email: string) =>
  patchRequest<PatchAccountReq, AccountRes>(`${basePath}/account`, { username, email });

export const updatePassword = (password: string) =>
  patchRequest<PatchAccountReq, AccountRes>(`${basePath}/account`, { password });
