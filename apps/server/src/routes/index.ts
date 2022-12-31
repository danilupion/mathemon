import { Router } from 'express';

import api from './api/index.js';
import oauth from './oauth/index.js';

const router = Router();

router.use('/api', api);
router.use('/oauth', oauth);

export default router;
