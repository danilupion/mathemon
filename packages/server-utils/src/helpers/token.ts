import config from 'config';
import { sign } from 'jsonwebtoken';

const jwtExpiration = config.get<string>('authentication.jwtExpiration');
const jwtSecret = config.get<string>('authentication.jwtSecret');

interface GenerateTokenOptions {
  expiresIn?: string | number;
  secret?: string;
}

export const generateToken = (
  payload: Record<string, unknown>,
  { expiresIn = jwtExpiration, secret = jwtSecret }: GenerateTokenOptions = {},
): Promise<string> =>
  new Promise((res, rej) => {
    sign(
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
