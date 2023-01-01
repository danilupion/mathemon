import config from 'config';
import { NextFunction, Request, Response } from 'express';
import jsonWebToken from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { RequestWith } from '../../../helpers/express/route.js';
import { ClientErrorForbidden, ClientErrorUnauthorized } from '../../../helpers/httpError.js';

const defaultProperty = 'jwtUser';

interface Jwt<UserRole extends string = string> {
  id: string;
  role: UserRole;
}

export type JwtData<UserRole extends string = string, Key extends string = 'jwtUser'> = {
  [key in Key]: Jwt<UserRole>;
};

const jwtSecret = config.get<string>('auth.jwt.secret');
const jwtExpiration = config.get<string>('auth.jwt.expiration');

/**
 * JWT strategy that will extend response with a new user property containing the id
 */
const strategy = new Strategy(
  {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  },
  <UserRole extends string = string>(payload: Jwt<UserRole>, done: VerifiedCallback) => {
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

const jwtAuth = ({ requestProperty = defaultProperty } = {}) => {
  if (!cache.has(requestProperty)) {
    cache.set(
      requestProperty,
      passport.authenticate('jwt', { session: false, assignProperty: requestProperty }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cache.get(requestProperty)!;
};

interface GenerateTokenOptions {
  expiresIn?: string | number;
  secret?: string;
}

export const generateToken = (
  payload: object,
  { expiresIn = jwtExpiration, secret = jwtSecret }: GenerateTokenOptions = {},
): Promise<string> =>
  new Promise((res, rej) => {
    jsonWebToken.sign(
      payload,
      secret,
      {
        expiresIn,
      },
      (err, encoded) => {
        if (err || encoded === undefined) {
          return rej(err);
        }
        return res(encoded);
      },
    );
  });

export const hasRole =
  <UserRole extends string, Key extends string>(
    roles: UserRole[],
    requestProperty: Key = defaultProperty as Key,
  ) =>
  (req: RequestWith<JwtData<UserRole, Key>>, res: Response, next: NextFunction) => {
    jwtAuth({ requestProperty })(req, res, () => {
      if (!roles.includes(req[requestProperty].role)) {
        throw new ClientErrorForbidden();
      }
      return next();
    });
  };

export default jwtAuth;
