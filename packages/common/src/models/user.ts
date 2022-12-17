import { WithEmail } from './common/email.js';
import { WithTimestamps } from './common/timestamps.js';

export enum UserRole {
  user = 'user',

  admin = 'admin',
  superAdmin = 'superAdmin',
}

export interface User extends WithEmail, WithTimestamps {
  username: string;
  role: UserRole;
}
