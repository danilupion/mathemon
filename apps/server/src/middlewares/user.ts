import { Jwt } from '@danilupion/turbo-server/middleware/express/auth/jwt.js';
import user from '@danilupion/turbo-server/middleware/express/auth/user.js';

import UserModel from '../models/user.js';

const userFromJwt = async (jwtData: Jwt) => {
  return await UserModel.findById(jwtData.id).exec();
};

const userMiddleware = user({
  reqAuthField: 'jwtUser',
  userFactory: userFromJwt,
});

export default userMiddleware;
