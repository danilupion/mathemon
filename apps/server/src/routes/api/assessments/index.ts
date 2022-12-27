import { CreateAssessmentBody } from '@mathemon/common/models/api/assessments.js';
import { RequestWithBody, postRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { createAssessment } from './controllers.js';
import { assessmentCreationValidator } from './validators.js';

const router = Router();

/**
 * Route: /api/assessments
 * Method: POST
 *
 * Returns a new assessment
 */
postRoute<RequestWithBody<CreateAssessmentBody>>(
  router,
  '/',
  assessmentCreationValidator,
  createAssessment,
);

export default router;
