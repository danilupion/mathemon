import { CreateTokenReq, CreateTokenRes } from '@mathemon/common/models/api/auth.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { ClientErrorUnauthorized } from '@mathemon/turbo-server/helpers/httpError.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { JwtData, generateToken } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';

import UserModel from '../../../../models/user.js';
import { getTokenPayload } from '../../../../utils/auth.js';

export const createToken = controller<CreateTokenReq, CreateTokenRes>(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    throw new ClientErrorUnauthorized();
  }

  const match = await user.comparePassword(req.body.password);
  if (!match) {
    throw new ClientErrorUnauthorized();
  }

  res.status(StatusCode.SuccessCreated).send({
    token: await generateToken(getTokenPayload(user)),
  });
});

export const renewToken = controller<never, CreateTokenRes, JwtData>(async (req, res) => {
  const user = await UserModel.findById(req.jwtUser.id);

  if (!user) {
    throw new ClientErrorUnauthorized();
  }

  res.status(StatusCode.SuccessOK).send({ token: await generateToken(getTokenPayload(user)) });
});
