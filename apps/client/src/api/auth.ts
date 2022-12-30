import { CreateTokenReq, CreateTokenRes } from '@mathemon/common/models/api/auth';
import { bodylessPutRequest, postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/auth/tokens';

export const generateToken = (email: string, password: string) =>
  postRequest<CreateTokenReq, CreateTokenRes>(basePath, {
    email,
    password,
  }).then((res) => res.token);

export const renewToken = () =>
  bodylessPutRequest<CreateTokenRes>(basePath).then((res) => res.token);
