import controller, {
  RequestWithBody,
  RequestWithFields,
  ResponseWithBody,
} from '@danilupion/turbo-server/helpers/express/controller.js';
import { ClientErrorConflict } from '@danilupion/turbo-server/helpers/httpError.js';
import { StatusCode } from '@danilupion/turbo-server/http.js';
import { UserData } from '@danilupion/turbo-server/middleware/express/auth/user.js';
import { AccountRes, PatchAccountReq } from '@mathemon/common/models/api/me.js';

import UserModel, { UserDocument } from '../../../../models/user.js';

export const getAccount = controller<
  RequestWithFields<UserData<UserDocument>>,
  ResponseWithBody<AccountRes>
>(async (req, res) => {
  return res.status(StatusCode.SuccessOK).send({
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

  return res.status(StatusCode.SuccessOK).send({
    email: req.user.email,
    username: req.user.username,
  });
});
