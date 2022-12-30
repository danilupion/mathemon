export interface CreateProfileReq {
  email: string;
  username: string;
  password: string;
}

export type CreateProfileRes = {
  success: boolean;
};
