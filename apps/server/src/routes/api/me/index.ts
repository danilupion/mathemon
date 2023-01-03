import { Router } from 'express';

import pokedex from './pokedex/index.js';

const router = Router();

router.use('/pokedex', pokedex);

export default router;
