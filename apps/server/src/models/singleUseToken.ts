import { randomBytes } from 'crypto';

import owner from '@mathemon/turbo-server/middleware/mongoose/owner.js';
import timestamps from '@mathemon/turbo-server/middleware/mongoose/timestamps.js';
import config from 'config';
import { Document, ObjectId, Schema, model } from 'mongoose';

const expiration = config.get<number>('settings.singleUseToken.expiresIn');

import { UserDocument } from './user.js';

export enum SingleUseTokenType {
  EmailVerification = 'emailVerification',
  PasswordReset = 'passwordReset',
}

export type SingleUseTokenDocument = Document & {
  token: string;
  user: ObjectId | UserDocument;
};

const singleUseTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(SingleUseTokenType),
    },
  },
  { collection: 'singleUseTokens', minimize: false },
)
  .plugin(owner)
  .plugin(timestamps, { update: false })
  .index({ created: 1 }, { unique: true, expires: expiration })
  .pre('validate', async function (next) {
    // only populate token if it's not already set
    if (!this.isNew) {
      return next(null);
    }

    try {
      // generate a random token
      randomBytes(32).toString('hex');
      this.set('token', randomBytes(32).toString('hex'));
      next(null);
    } catch (err) {
      if (err instanceof Error) {
        return next(err);
      }
    }
  });

export default model<SingleUseTokenDocument>('SingleUseToken', singleUseTokenSchema);
