import { getRoute, patchRoute } from '@danilupion/turbo-server/helpers/express/route.js';
import jwtAuth from '@danilupion/turbo-server/middleware/express/auth/jwt.js';
import { Router } from 'express';

import userMiddleware from '../../../../middlewares/user.js';

import { getAccount, patchAccount } from './controllers.js';
import { validateAccountEdition } from './validators.js';

const router = Router();

getRoute(router, '/', jwtAuth(), userMiddleware, getAccount);
patchRoute(router, '/', validateAccountEdition, jwtAuth(), userMiddleware, patchAccount);

export default router;
