import { CreateProfileReq, CreateProfileRes } from '@mathemon/common/models/api/profiles';
import { postRequest } from '@mathemon/turbo-client/rest/request';

const basePath = '/api/profiles';

export const createProfile = (username: string, email: string, password: string) =>
  postRequest<CreateProfileReq, CreateProfileRes>(basePath, {
    email,
    username,
    password,
  });
