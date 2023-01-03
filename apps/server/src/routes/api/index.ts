import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Router } from 'express';

import auth from './auth/index.js';
import evaluations from './evaluations/index.js';
import me from './me/index.js';
import profiles from './profiles/index.js';
import quizzes from './quizzes/index.js';

const router = Router();

router.use('/auth', auth);
router.use('/evaluations', evaluations);
router.use('/me', me);
router.use('/profiles', profiles);
router.use('/quizzes', quizzes);

router.use('*', (_, res) => {
  res.sendStatus(StatusCode.ServerErrorNotImplemented);
});

export default router;
