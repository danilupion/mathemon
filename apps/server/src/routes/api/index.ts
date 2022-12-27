import { StatusCode } from '@mathemon/turbo-server/http.js';
import { Router } from 'express';

import assessments from './assessments/index.js';
import auth from './auth/index.js';
import pokemons from './pokemons/index.js';
import quizzes from './quizzes/index.js';

const router = Router();

router.use('/auth', auth);
router.use('/pokemons', pokemons);
router.use('/quizzes', quizzes);
router.use('/assessments', assessments);

router.use('*', (_, res) => {
  res.sendStatus(StatusCode.ServerErrorNotImplemented);
});

export default router;
