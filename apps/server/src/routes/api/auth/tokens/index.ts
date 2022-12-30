import { postRoute, putRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import jwt from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import { Router } from 'express';

import { createToken, renewToken } from './controllers.js';
import { validateTokenCreation } from './validators.js';

const router = Router();

/**
 * Route: /api/auth/tokens
 * Method: POST
 *
 * Authenticates a user and returns a jwt if successful
 */
postRoute(router, '/', validateTokenCreation, createToken);

/**
 * Route: /api/auth/tokens
 * Method: PUT
 *
 * Renews a jwt given a non expired one and returns it jwt if successful
 */
putRoute(router, '/', jwt(), renewToken);

export default router;
