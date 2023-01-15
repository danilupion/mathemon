import { CreateProfileReq, CreateProfileRes } from '@mathemon/common/models/api/profiles.js';
import { sendEmail } from '@mathemon/turbo-server/helpers/email.js';
import controller, {
  RequestWithBody,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { ClientErrorConflict } from '@mathemon/turbo-server/helpers/httpError.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import config from 'config';

import emailVerificationToken from '../../../models/emailVerificationToken.js';
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

  const token = await emailVerificationToken.create({
    user: user,
  });

  await sendEmail({
    to: req.body.email,
    subject: 'Verifica to email',
    text: `Pincha aquí para comprobar tu email: ${url}/tokens/verify/${token.token}`,
  });

  return res.status(StatusCode.SuccessCreated).send({
    success: !!user,
  });
});
