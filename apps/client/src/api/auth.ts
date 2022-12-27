import { CreateTokenBody } from '@mathemon/common/models/api/auth';
import { bodylessPutRequest, postRequest } from '@mathemon/turbo-client/rest/methods';

type PostTokenResponse = {
  token: string;
};

const basePath = '/api/auth/tokens';

export const generateToken = (usernameOrEmail: string, password: string) =>
  postRequest<CreateTokenBody, PostTokenResponse>(basePath, { usernameOrEmail, password }).then(
    (res) => res.token,
  );

export const renewToken = () =>
  bodylessPutRequest<PostTokenResponse>(basePath).then((res) => res.token);
