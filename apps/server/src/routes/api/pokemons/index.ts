import { getRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { getAllPokemons } from './handlers.js';

const router = Router();

/**
 * Route: /api/pokemons
 * Method: GET
 *
 * Returns all pokemons
 */
getRoute(router, '/', getAllPokemons);

export default router;
