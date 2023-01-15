export interface CreateProfileReq {
  email: string;
  username: string;
  password: string;
}

export type CreateProfileRes = {
  success: boolean;
};

export interface CreatePasswordResetTokenReq {
  email: string;
}

export interface ChangePasswordReq {
  token: string;
  password: string;
}
