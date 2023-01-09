import { getRoute, patchRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import jwtAuth from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import user from '@mathemon/turbo-server/middleware/express/auth/user.js';
import { Router } from 'express';

import { getAccount, patchAccount, userFromJwt } from './controllers.js';
import { validateAccountEdition } from './validators.js';

const router = Router();

const userMiddleware = user({
  reqAuthField: 'jwtUser',
  userFactory: userFromJwt,
});

getRoute(router, '/', jwtAuth(), userMiddleware, getAccount);
patchRoute(router, '/', validateAccountEdition, jwtAuth(), userMiddleware, patchAccount);

export default router;
