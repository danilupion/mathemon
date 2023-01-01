import { postRoute, putRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import jwt from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import { Router } from 'express';

import { createToken, renewToken } from './controllers.js';
import { validateTokenCreation } from './validators.js';

const router = Router();

postRoute(router, '/', validateTokenCreation, createToken);

putRoute(router, '/', jwt(), renewToken);

export default router;
