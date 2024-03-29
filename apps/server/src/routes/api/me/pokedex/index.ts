import { getRoute } from '@danilupion/turbo-server/helpers/express/route.js';
import jwtAuth from '@danilupion/turbo-server/middleware/express/auth/jwt.js';
import { Router } from 'express';

import userMiddleware from '../../../../middlewares/user.js';

import { getPokedex } from './controllers.js';

const router = Router();

getRoute(router, '/', jwtAuth(), userMiddleware, getPokedex);

export default router;
