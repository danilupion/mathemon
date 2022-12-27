import { BadRequestError } from '@mathemon/turbo-common/rest/error.js';

import {
  createInitForDelete,
  createInitForGet,
  createInitForPatch,
  createInitForPost,
  createInitForPut,
} from './init.js';

const statusMiddleware = async (res: Response) => {
  if (res.status === 400) {
    const validationErrors = await res.json();
    throw new BadRequestError('Bad request error', validationErrors);
  }
  if (res.status >= 400) {
    throw new Error(`Response with bad status ${res.status}`);
  }

  return res;
};

const jsonHandler = <Res>(res: Response) => res.json() as Promise<Res>;

const jsonFetch = async <Res, NoResponse extends boolean = false>(
  url: string,
  init: RequestInit,
  noResponse: NoResponse = false as NoResponse,
): Promise<NoResponse extends true ? void : Res> => {
  const result = await fetch(url, init).then(statusMiddleware);

  if (noResponse) {
    return undefined as never;
  }

  return (await jsonHandler<Res>(result)) as never;
};

interface RequestOptions<NoResponse extends boolean> {
  init?: RequestInit;
  noResponse?: NoResponse;
}

const bodylessRequest =
  (initFactory: () => RequestInit, responselessRequest = false) =>
  <Res, NoResponse extends boolean = false>(
    url: string,
    {
      init = initFactory(),
      noResponse = responselessRequest as NoResponse,
    }: RequestOptions<NoResponse> = {},
  ) => {
    return jsonFetch<Res, NoResponse>(
      url,
      {
        ...init,
      },
      noResponse,
    );
  };

const bodyRequest =
  (initFactory: () => RequestInit, responselessRequest = false) =>
  <Body, Res, NoResponse extends boolean = false>(
    url: string,
    data: Body,
    {
      init = initFactory(),
      noResponse = responselessRequest as NoResponse,
    }: RequestOptions<NoResponse> = {},
  ) =>
    jsonFetch<Res, NoResponse>(
      url,
      {
        ...init,
        body: JSON.stringify(data),
      },
      noResponse,
    );

export const getRequest = bodylessRequest(createInitForGet);
export const postRequest = bodyRequest(createInitForPost);
export const bodylessPostRequest = bodylessRequest(createInitForPost);
export const patchRequest = bodyRequest(createInitForPatch);
export const bodylessPatchRequest = bodylessRequest(createInitForPatch);
export const putRequest = bodyRequest(createInitForPut);
export const bodylessPutRequest = bodylessRequest(createInitForPut);
export const deleteRequest = bodylessRequest(createInitForDelete, true);
