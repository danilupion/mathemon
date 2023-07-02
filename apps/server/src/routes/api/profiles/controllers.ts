import { sendEmail } from '@danilupion/turbo-server/helpers/email.js';
import controller, {
  RequestWithBody,
  ResponseWithBody,
} from '@danilupion/turbo-server/helpers/express/controller.js';
import { ClientErrorConflict } from '@danilupion/turbo-server/helpers/httpError.js';
import { SuccessStatusCode } from '@danilupion/turbo-server/http.js';
import { CreateProfileReq, CreateProfileRes } from '@mathemon/common/models/api/profiles.js';
import config from 'config';

import SingleUseTokenModel, { SingleUseTokenType } from '../../../models/singleUseToken.js';
import UserModel from '../../../models/user.js';

const url = config.get<string>('url');

export const createProfile = controller<
  RequestWithBody<CreateProfileReq>,
  ResponseWithBody<CreateProfileRes>
>(async (req, res) => {
  const existingUser = await UserModel.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });

  if (existingUser) {
    throw new ClientErrorConflict();
  }

  const user = await UserModel.create({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  const token = await SingleUseTokenModel.create({
    user: user,
    type: SingleUseTokenType.EmailVerification,
  });

  await sendEmail({
    to: req.body.email,
    subject: 'Verifica to email',
    text: `Pincha aquí para comprobar tu email: ${url}/tokens/verify/${token.token}`,
  });

  return res.status(SuccessStatusCode.SuccessCreated).send({
    success: !!user,
  });
});
