import { getRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import googleOauthMiddleware from '@mathemon/turbo-server/middleware/express/oauth/google.js';
import config from 'config';
import { Router } from 'express';

import { createTokenFromUser, userFromProfile } from '../controllers.js';

const { initialize, initiator, callback } = googleOauthMiddleware;

const router = Router();

const url = config.get<string>('url');

initialize({
  callbackURL: `${url}/oauth/google/callback`,
  userFromProfile: userFromProfile(
    'google',
    (profile) => profile.emails && profile.emails.find((email) => email.verified)?.value,
  ),
});

getRoute(router, '/', initiator());
getRoute(router, '/callback', callback(), createTokenFromUser);

export default router;
