import { CreateQuizRequest } from '@mathemon/common/models/api/quizzes.js';
import { RequestWithBody, postRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { createQuiz } from './controllers.js';
import { quizCreationValidator } from './validators.js';

const router = Router();

/**
 * Route: /api/quizzes
 * Method: POST
 *
 * Returns a new quiz
 */
postRoute<RequestWithBody<CreateQuizRequest>>(router, '/', quizCreationValidator, createQuiz);

export default router;
