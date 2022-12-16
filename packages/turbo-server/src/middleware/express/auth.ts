import config from 'config';
import { NextFunction, Response } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { RequestWith } from '../../helpers/express/route.js';
import { ClientErrorForbidden, ClientErrorUnauthorized } from '../../helpers/httpError.js';

interface JwtData<UserRole extends string = string> {
  id: string;
  role: UserRole;
}

export type RequestWithJwtData<UserRole extends string = string> = RequestWith<
  JwtData<UserRole>,
  'jwtUser'
>;

const jwtSecret = config.get<string>('authentication.jwtSecret');

const params = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

/**
 * JWT strategy that will extend response with a new user property containing the id
 */
const strategy = new Strategy(
  params,
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

export const jwtAuth = passport.authenticate('jwt', {
  session: false,
  assignProperty: 'jwtUser',
});

export const hasRole =
  <UserRole extends string = string>(roles: UserRole[]) =>
  (req: RequestWithJwtData<UserRole>, res: Response, next: NextFunction) => {
    jwtAuth(req, res, () => {
      if (!roles.includes(req.jwtUser.role)) {
        throw new ClientErrorForbidden();
      }
      return next();
    });
  };

// export const isAdmin = hasRole([UserRole.admin, UserRole.superAdmin]);
