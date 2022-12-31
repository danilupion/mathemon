import config from 'config';
import passport from 'passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { ClientErrorUnauthorized } from '../../../helpers/httpError.js';

const clientID = config.get<string>('auth.google.clientId');
const clientSecret = config.get<string>('auth.google.clientSecret');

const strategyName = 'turbo-google';

type GoogleAuthMiddlewareOptions<User extends object> = {
  googleClientId?: string;
  googleClientSecret?: string;
  callbackURL: string;
  userFromProfile: (profile: Profile) => Promise<User | null | undefined>;
  scope?: string[];
};

export const registerGoogleAuth = <User extends object>({
  callbackURL,
  userFromProfile,
  googleClientId = clientID,
  googleClientSecret = clientSecret,
}: GoogleAuthMiddlewareOptions<User>) => {
  const strategy = new Strategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL,
      passReqToCallback: true,
    },
    async (_req, _accessToken, _refreshToken, profile, done) => {
      try {
        const user = await userFromProfile(profile);

        if (!user) {
          return done(new ClientErrorUnauthorized() as unknown as Error);
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    },
  );

  passport.use(strategyName, strategy);
};

export const initiator = ({ scope = ['email', 'profile'] } = {}) => {
  return passport.authenticate(strategyName, { scope });
};

export const callback = ({ session = false } = {}) =>
  passport.authenticate(strategyName, { session });
