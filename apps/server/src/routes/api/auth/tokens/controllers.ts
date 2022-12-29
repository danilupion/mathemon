import { CreateTokenRequest, CreateTokenResponse } from '@mathemon/common/models/api/auth.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { ClientErrorUnauthorized } from '@mathemon/turbo-server/helpers/httpError.js';
import { generateToken } from '@mathemon/turbo-server/helpers/token.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { JwtDataField } from '@mathemon/turbo-server/middleware/express/auth.js';

import UserModel, { UserDocument } from '../../../../models/user.js';

export const getTokenPayload = (user: UserDocument) => ({
  id: user._id.toString(),
  email: user.email,
  username: user.username,
  role: user.role,
});

export const createToken = controller<CreateTokenRequest, CreateTokenResponse>(async (req, res) => {
  const user = await UserModel.findOne({
    $or: [{ email: req.body.usernameOrEmail }, { username: req.body.usernameOrEmail }],
  });

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

export const renewToken = controller<never, CreateTokenResponse, JwtDataField>(async (req, res) => {
  const user = await UserModel.findById(req.jwtUser.id);

  if (!user) {
    throw new ClientErrorUnauthorized();
  }

  res.status(StatusCode.SuccessOK).send({ token: await generateToken(getTokenPayload(user)) });
});
