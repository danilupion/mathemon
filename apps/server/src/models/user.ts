import email from '@danilupion/turbo-server/middleware/mongoose/email.js';
import normalizeJson from '@danilupion/turbo-server/middleware/mongoose/normalizeJson.js';
import oauthProfile, {
  WithOauthProfile,
} from '@danilupion/turbo-server/middleware/mongoose/oauthProfile.js';
import password, { WithPassword } from '@danilupion/turbo-server/middleware/mongoose/password.js';
import timestamps from '@danilupion/turbo-server/middleware/mongoose/timestamps.js';
import { User, UserRole } from '@mathemon/common/models/user.js';
import { Document, Schema, model } from 'mongoose';

export type UserDocument = Document &
  User & {
    verified: boolean;
  } & WithPassword &
  WithOauthProfile<'google'> &
  WithOauthProfile<'facebook'>;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.user,
    },
  },
  { collection: 'users', minimize: false },
)
  .plugin(email)
  .plugin(password, { required: false })
  .plugin(oauthProfile, { field: 'google', parent: 'profiles' })
  .plugin(oauthProfile, { field: 'facebook', parent: 'profiles' })
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v'] });

export default model<UserDocument>('User', userSchema);
