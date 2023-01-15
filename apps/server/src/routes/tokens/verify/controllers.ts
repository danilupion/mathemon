import controller, {
  RequestWithParams,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import config from 'config';

import SingleUseTokenModel, { SingleUseTokenType } from '../../../models/singleUseToken.js';
import { UserDocument } from '../../../models/user.js';

const expiration = config.get<number>('settings.singleUseToken.expiresIn');

export const verifyEmailToken = controller<RequestWithParams<{ token: string }>>(
  async (req, res) => {
    const limit = new Date();
    limit.setTime(limit.getTime() - expiration * 1000);

    const tokenToVerify = await SingleUseTokenModel.findOne({
      token: req.params.token,
      type: SingleUseTokenType.EmailVerification,
      created: { $gte: limit },
    }).populate('user');

    if (!tokenToVerify || !tokenToVerify.user) {
      return res.redirect('/signIn?emailValidation=false');
    }

    const user = tokenToVerify.user as UserDocument;

    user.verified = true;
    await Promise.all([user.save(), tokenToVerify.remove()]);

    res.redirect('/signIn?emailValidation=true');
  },
);
