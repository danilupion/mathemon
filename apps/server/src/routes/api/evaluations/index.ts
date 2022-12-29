import { postRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { createEvaluation } from './controllers.js';
import { evaluationCreationValidator } from './validators.js';

const router = Router();

/**
 * Route: /api/evaluations
 * Method: POST
 *
 * Returns a new evaluation.
 */
postRoute(router, '/', evaluationCreationValidator, createEvaluation);

export default router;
