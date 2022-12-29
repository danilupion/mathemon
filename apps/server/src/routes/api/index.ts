import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Router } from 'express';

import auth from './auth/index.js';
import evaluations from './evaluations/index.js';
import pokedex from './pokedex/index.js';
import quizzes from './quizzes/index.js';

const router = Router();

router.use('/auth', auth);
router.use('/pokedex', pokedex);
router.use('/quizzes', quizzes);
router.use('/evaluations', evaluations);

router.use('*', (_, res) => {
  res.sendStatus(StatusCode.ServerErrorNotImplemented);
});

export default router;
