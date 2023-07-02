import { sendEmail } from '@danilupion/turbo-server/helpers/email.js';
import controller, {
  RequestWithBody,
  ResponseWithBody,
} from '@danilupion/turbo-server/helpers/express/controller.js';
import { ClientErrorStatusCode } from '@danilupion/turbo-server/http.js';
import {
  ChangePasswordReq,
  CreatePasswordResetTokenReq,
} from '@mathemon/common/models/api/profiles.js';
import config from 'config';

import SingleUseTokenModel, { SingleUseTokenType } from '../../../../models/singleUseToken.js';
import UserModel, { UserDocument } from '../../../../models/user.js';

const url = config.get<string>('url');
const expiration = config.get<number>('settings.singleUseToken.expiresIn');

export const createPasswordToken = controller<
  RequestWithBody<CreatePasswordResetTokenReq>,
  ResponseWithBody<void>
>(async (req, res) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  });

  if (user) {
    const token = await SingleUseTokenModel.create({
      user: user,
      type: SingleUseTokenType.PasswordReset,
    });

    await sendEmail({
      to: req.body.email,
      subject: 'Cambio de contraseña',
      text: `Pincha aquí para cambiar tu contraseña: ${url}/signIn/reset-password/${token.token}`,
    });
  }

  return res.status(200).send();
});

export const changePassword = controller<
  RequestWithBody<ChangePasswordReq>,
  ResponseWithBody<void>
>(async (req, res) => {
  const limit = new Date();
  limit.setTime(limit.getTime() - expiration * 1000);

  const tokenToUse = await SingleUseTokenModel.findOne({
    token: req.body.token,
    type: SingleUseTokenType.PasswordReset,
    created: { $gte: limit },
  }).populate('user');

  if (!tokenToUse || !tokenToUse.user) {
    return res.status(ClientErrorStatusCode.ClientErrorNotFound).send();
  }

  const user = tokenToUse.user as UserDocument;

  user.verified = true;
  user.password = req.body.password;

  await Promise.all([user.save(), SingleUseTokenModel.deleteOne({ _id: tokenToUse._id }).exec()]);

  return res.status(200).send();
});
