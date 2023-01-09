import { Router } from 'express';

import account from './account/index.js';
import pokedex from './pokedex/index.js';

const router = Router();

router.use('/account', account);
router.use('/pokedex', pokedex);

export default router;
