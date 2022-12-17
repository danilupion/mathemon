import { Router } from 'express';

import token from './tokens/index.js';

const router = Router();

router.use('/tokens', token);

export default router;
