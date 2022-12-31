import { User, UserRole } from '@mathemon/common/models/user.js';
import email from '@mathemon/turbo-server/middleware/mongoose/email.js';
import normalizeJson from '@mathemon/turbo-server/middleware/mongoose/normalizeJson.js';
import google, { WithGoogle } from '@mathemon/turbo-server/middleware/mongoose/oauth/google.js';
import password, { WithPassword } from '@mathemon/turbo-server/middleware/mongoose/password.js';
import timestamps from '@mathemon/turbo-server/middleware/mongoose/timestamps.js';
import { Document, Schema, model } from 'mongoose';

export type UserDocument = Document & User & WithPassword & WithGoogle;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
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
  .plugin(google, { parent: 'profiles' })
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v'] });

export default model<UserDocument>('User', UserSchema);
