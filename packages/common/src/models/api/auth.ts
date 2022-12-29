export interface CreateTokenReq {
  usernameOrEmail: string;
  password: string;
}

export type CreateTokenRes = {
  token: string;
};
