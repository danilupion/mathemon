import { postRequest, putRequest } from '@mathemon/turbo-client/rest/methods';

type PostTokenResponse = {
  token: string;
};

const basePath = '/api/auth/tokens';

export const generateToken = (usernameOrEmail: string, password: string) =>
  postRequest<PostTokenResponse>(basePath, { usernameOrEmail, password }).then((res) => res.token);

export const renewToken = () => putRequest<PostTokenResponse>(basePath).then((res) => res.token);
