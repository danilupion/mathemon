import { CreateTokenRequest, CreateTokenResponse } from '@mathemon/common/models/api/auth';
import { bodylessPutRequest, postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/auth/tokens';

export const generateToken = (usernameOrEmail: string, password: string) =>
  postRequest<CreateTokenRequest, CreateTokenResponse>(basePath, {
    usernameOrEmail,
    password,
  }).then((res) => res.token);

export const renewToken = () =>
  bodylessPutRequest<CreateTokenResponse>(basePath).then((res) => res.token);
