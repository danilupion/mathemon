import { postRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { createProfile } from './controllers.js';
import passwordResetTokens from './passwordResetTokens/index.js';
import { validateProfileCreation } from './validators.js';

const router = Router();

router.use('/passwordResetTokens', passwordResetTokens);

postRoute(router, '/', validateProfileCreation, createProfile);

export default router;
