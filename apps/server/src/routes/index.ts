import { router } from '@slangy/express';

import api from './api/index.js';

export default router().use('/api', api) ;
