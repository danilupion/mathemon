import { getRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { getAllPokemons } from './controllers.js';

const router = Router();

getRoute(router, '/', getAllPokemons);

export default router;
