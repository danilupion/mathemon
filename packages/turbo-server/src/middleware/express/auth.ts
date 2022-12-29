import config from 'config';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { RequestWith } from '../../helpers/express/route.js';
import { ClientErrorForbidden, ClientErrorUnauthorized } from '../../helpers/httpError.js';

const defaultProperty = 'jwtUser';

interface JwtData<UserRole extends string = string> {
  id: string;
  role: UserRole;
}

export type JwtDataField<UserRole extends string = string, Key extends string = 'jwtUser'> = {
  [key in Key]: JwtData<UserRole>;
};

const jwtSecret = config.get<string>('authentication.jwtSecret');

/**
 * JWT strategy that will extend response with a new user property containing the id
 */
const strategy = new Strategy(
  {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  },
  <UserRole extends string = string>(payload: JwtData<UserRole>, done: VerifiedCallback) => {
    if (payload.id) {
      return done(null, {
        id: payload.id,
        role: payload.role,
      });
    }

    return done(new ClientErrorUnauthorized());
  },
);

passport.use(strategy);

type Authenticator = (req: Request, res: Response, next: NextFunction) => void;

const cache = new Map<string, Authenticator>();

export const jwtAuth = ({ requestProperty = defaultProperty } = {}) => {
  if (!cache.has(requestProperty)) {
    cache.set(
      requestProperty,
      passport.authenticate('jwt', { session: false, assignProperty: requestProperty }),
    );
  }

  return cache.get(requestProperty)!;
};

export const hasRole =
  <UserRole extends string, Key extends string>(
    roles: UserRole[],
    requestProperty: Key = defaultProperty as Key,
  ) =>
  (req: RequestWith<JwtDataField<UserRole, Key>>, res: Response, next: NextFunction) => {
    jwtAuth({ requestProperty })(req, res, () => {
      if (!roles.includes(req[requestProperty].role)) {
        throw new ClientErrorForbidden();
      }
      return next();
    });
  };
