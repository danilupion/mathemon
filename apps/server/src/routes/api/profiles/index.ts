import { postRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { createProfile } from './controllers.js';
import { validateProfileCreation } from './validators.js';

const router = Router();

/**
 * Route: /api/profiles
 * Method: POST
 *
 * Creates a new profile
 */
postRoute(router, '/', validateProfileCreation, createProfile);

export default router;
