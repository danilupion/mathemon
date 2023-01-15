import { postRoute, putRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { changePassword, createPasswordToken } from './controllers.js';
import { validatePasswordChange, validatePasswordTokenCreation } from './validators.js';

const router = Router();

postRoute(router, '/', validatePasswordTokenCreation, createPasswordToken);

putRoute(router, '/', validatePasswordChange, changePassword);

export default router;
