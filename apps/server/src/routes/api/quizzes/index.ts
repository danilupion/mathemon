import { postRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { createPracticeQuiz, createRealQuiz } from './controllers.js';
import { practiceCreationValidator, quizCreationValidator } from './validators.js';

const router = Router();

postRoute(router, '/real', quizCreationValidator, createRealQuiz);

postRoute(router, '/practice', practiceCreationValidator, createPracticeQuiz);

export default router;
