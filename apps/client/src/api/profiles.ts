import {
  ChangePasswordReq,
  CreatePasswordResetTokenReq,
  CreateProfileReq,
  CreateProfileRes,
} from '@mathemon/common/models/api/profiles';
import {
  postRequest,
  responselessPostRequest,
  responselessPutRequest,
} from '@mathemon/turbo-client/rest/request';

const basePath = '/api/profiles';

export const createProfile = (username: string, email: string, password: string) =>
  postRequest<CreateProfileReq, CreateProfileRes>(basePath, {
    email,
    username,
    password,
  });

export const createPasswordResetToken = (email: string) =>
  responselessPostRequest<CreatePasswordResetTokenReq, void, true>(
    `${basePath}/passwordResetTokens`,
    {
      email,
    },
  );

export const changePassword = (token: string, password: string) =>
  responselessPutRequest<ChangePasswordReq, void, true>(`${basePath}/passwordResetTokens`, {
    token,
    password,
  });
