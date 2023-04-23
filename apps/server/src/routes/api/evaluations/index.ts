import { postRoute } from '@danilupion/turbo-server/helpers/express/route.js';
import jwtAuth from '@danilupion/turbo-server/middleware/express/auth/jwt.js';
import { Router } from 'express';

import { createEvaluation } from './controllers.js';
import { evaluationCreationValidator } from './validators.js';

const router = Router();

postRoute(
  router,
  '/',
  evaluationCreationValidator,
  jwtAuth({ mandatory: false }),
  createEvaluation,
);

export default router;
