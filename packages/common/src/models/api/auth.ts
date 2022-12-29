export interface CreateTokenRequest {
  usernameOrEmail: string;
  password: string;
}

export type CreateTokenResponse = {
  token: string;
};
