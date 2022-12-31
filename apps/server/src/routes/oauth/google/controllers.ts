import { CreateTokenRes } from '@mathemon/common/models/api/auth.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { ClientErrorUnauthorized } from '@mathemon/turbo-server/helpers/httpError.js';
import { generateToken } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';

import { UserDocument } from '../../../models/user.js';
import { getTokenPayload } from '../../../utils/auth.js';

type UserFiled = {
  user?: UserDocument;
};

export const createTokenFromUser = controller<never, CreateTokenRes, UserFiled>(
  async (req, res) => {
    if (!req.user) {
      throw new ClientErrorUnauthorized();
    }

    res.redirect('/token?token=' + (await generateToken(getTokenPayload(req.user))));
  },
);
