import { WithEmail } from '@danilupion/turbo-common/model/email.js';
import { WithTimestamps } from '@danilupion/turbo-common/model/timestamps.js';

export enum UserRole {
  user = 'user',

  admin = 'admin',
  superAdmin = 'superAdmin',
}

export interface User extends WithEmail, WithTimestamps {
  username: string;
  role: UserRole;
}
