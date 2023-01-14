import { randomBytes } from 'crypto';

import owner from '@mathemon/turbo-server/middleware/mongoose/owner.js';
import timestamps from '@mathemon/turbo-server/middleware/mongoose/timestamps.js';
import config from 'config';
import { Document, ObjectId, Schema, model } from 'mongoose';

const expiration = config.get<number>('settings.verificationToken.expiresIn');

import { UserDocument } from './user.js';

export type EmailVerificationTokenDocument = Document & {
  token: string;
  user: ObjectId | UserDocument;
};

const emailVerificationTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { collection: 'emailVerificationTokens', minimize: false },
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

const EmailVerificationTokenModel = model<EmailVerificationTokenDocument>(
  'EmailVerificationToken',
  emailVerificationTokenSchema,
);

EmailVerificationTokenModel.syncIndexes();

export default EmailVerificationTokenModel;
