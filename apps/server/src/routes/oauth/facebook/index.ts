import { getRoute } from '@danilupion/turbo-server/helpers/express/route.js';
import facebookOauthMiddleware, {
  FacebookProfile,
} from '@danilupion/turbo-server/middleware/express/oauth/facebook.js';
import config from 'config';
import { Router } from 'express';

import { createTokenFromUser, userFromProfile } from '../controllers.js';

const { initialize, initiator, callback } = facebookOauthMiddleware;

const router = Router();

const url = config.get<string>('url');

initialize({
  callbackURL: `${url}/oauth/facebook/callback`,
  userFromProfile: userFromProfile<FacebookProfile>(
    'facebook',
    (profile) => profile.emails && profile.emails[0] && profile.emails[0].value,
  ),
});

getRoute(router, '/', initiator());
getRoute(router, '/callback', callback(), createTokenFromUser);

export default router;
