import { getRoute } from '@danilupion/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { verifyEmailToken } from './controllers.js';

const router = Router();

getRoute(router, '/:token', verifyEmailToken);

export default router;
