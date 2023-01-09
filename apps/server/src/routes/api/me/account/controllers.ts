import { AccountRes, PatchAccountReq } from '@mathemon/common/models/api/me.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { ClientErrorConflict } from '@mathemon/turbo-server/helpers/httpError.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Jwt } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import { UserData } from '@mathemon/turbo-server/middleware/express/auth/user.js';

import UserModel, { UserDocument } from '../../../../models/user.js';

export const userFromJwt = async (jwtData: Jwt) => {
  return await UserModel.findById(jwtData.id).exec();
};

export const getAccount = controller<
  RequestWithFields<UserData<UserDocument>>,
  ResponseWithBody<AccountRes>
>(async (req, res) => {
  res.status(StatusCode.SuccessOK).send({
    email: req.user.email,
    username: req.user.username,
  });
});

export const patchAccount = controller<
  RequestWithBody<PatchAccountReq, RequestWithFields<UserData<UserDocument>>>,
  ResponseWithBody<AccountRes>
>(async (req, res) => {
  const { username, email, password } = req.body;

  if (username) {
    const existingUser = await UserModel.findOne({ username, _id: { $ne: req.user._id } }).exec();
    if (existingUser) {
      throw new ClientErrorConflict();
    }
    req.user.username = username;
  }

  if (email) {
    const existingUser = await UserModel.findOne({ email, _id: { $ne: req.user._id } }).exec();
    if (existingUser) {
      throw new ClientErrorConflict();
    }
    req.user.email = email;
  }

  if (password) {
    req.user.password = password;
  }

  await req.user.save();

  res.status(StatusCode.SuccessOK).send({
    email: req.user.email,
    username: req.user.username,
  });
});
