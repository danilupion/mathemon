import { getRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import jwtAuth from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import { Router } from 'express';

import { getPokedex } from './controllers.js';

const router = Router();

getRoute(router, '/', jwtAuth(), getPokedex);

export default router;
