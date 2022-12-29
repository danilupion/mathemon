import { getRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import { Router } from 'express';

import { getAllPokemons } from './controllers.js';

const router = Router();

/**
 * Route: /api/pokedex
 * Method: GET
 *
 * Returns all pokemons
 */
getRoute(router, '/', getAllPokemons);

export default router;
