import { BadRequestError } from '@mathemon/turbo-common/rest/error.js';

import {
  createInitForDelete,
  createInitForGet,
  createInitForPatch,
  createInitForPost,
  createInitForPut,
} from './init.js';

interface Dictionary {
  [key: string]: unknown;
}

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

const jsonHandler = <T>(res: Response) => res.json() as Promise<T>;

const jsonFetch = async <T, NoResponse extends boolean = false>(
  url: string,
  init: RequestInit,
  noResponse: NoResponse = false as NoResponse,
): Promise<NoResponse extends true ? void : T> => {
  const result = await fetch(url, init).then(statusMiddleware);

  if (noResponse) {
    return undefined as never;
  }

  return (await jsonHandler<T>(result)) as never;
};

interface RequestOptions<NoResponse extends boolean> {
  init?: RequestInit;
  noResponse?: NoResponse;
}

const bodylessRequest =
  (initFactory: () => RequestInit, responselessRequest = false) =>
  <T, NoResponse extends boolean = false>(
    url: string,
    {
      init = initFactory(),
      noResponse = responselessRequest as NoResponse,
    }: RequestOptions<NoResponse> = {},
  ) => {
    return jsonFetch<T, NoResponse>(
      url,
      {
        ...init,
      },
      noResponse,
    );
  };

const bodyRequest =
  (initFactory: () => RequestInit, responselessRequest = false) =>
  <T, NoResponse extends boolean = false>(
    url: string,
    data?: Dictionary | FormData,
    {
      init = initFactory(),
      noResponse = responselessRequest as NoResponse,
    }: RequestOptions<NoResponse> = {},
  ) => {
    if (data instanceof FormData && init.headers) {
      const headers = init.headers as Dictionary;
      delete headers['content-type'];
    }

    return jsonFetch<T, NoResponse>(
      url,
      {
        ...init,
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      noResponse,
    );
  };

export const getRequest = bodylessRequest(createInitForGet);
export const postRequest = bodyRequest(createInitForPost);
export const patchRequest = bodyRequest(createInitForPatch);
export const putRequest = bodyRequest(createInitForPut);
export const deleteRequest = bodylessRequest(createInitForDelete, true);
