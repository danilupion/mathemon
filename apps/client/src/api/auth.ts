import { bodilessPutRequest, postRequest } from '@danilupion/turbo-client/rest/request';
import { CreateTokenReq, CreateTokenRes } from '@mathemon/common/models/api/auth';

const basePath = '/api/auth/tokens';

export const generateToken = (email: string, password: string) =>
  postRequest<CreateTokenReq, CreateTokenRes>(basePath, {
    email,
    password,
  }).then((res) => res.token);

export const renewToken = () =>
  bodilessPutRequest<CreateTokenRes>(basePath).then((res) => res.token);
