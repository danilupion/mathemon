import { Router } from 'express';

import api from './api/index.js';
import oauth from './oauth/index.js';
import tokens from './tokens/index.js';

const router = Router();

router.use('/api', api);
router.use('/oauth', oauth);
router.use('/tokens', tokens);

export default router;
