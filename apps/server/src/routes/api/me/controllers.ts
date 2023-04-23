import { Jwt } from '@danilupion/turbo-server/middleware/express/auth/jwt.js';

import UserModel from '../../../models/user.js';

export const userFromJwt = async (jwtData: Jwt | null | undefined) => {
  if (!jwtData) {
    return null;
  }

  return await UserModel.findOne({ _id: jwtData.id });
};
