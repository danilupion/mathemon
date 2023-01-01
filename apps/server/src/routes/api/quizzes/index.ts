import { postRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { createQuiz } from './controllers.js';
import { quizCreationValidator } from './validators.js';

const router = Router();

postRoute(router, '/', quizCreationValidator, createQuiz);

export default router;
