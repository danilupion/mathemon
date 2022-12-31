import { getRoute } from '@mathemon/turbo-server/helpers/express/route.js';
import {
  callback,
  initiator,
  registerGoogleAuth,
} from '@mathemon/turbo-server/middleware/express/oauth/google.js';
import config from 'config';
import { Router } from 'express';

import UserModel from '../../../models/user.js';

import { createTokenFromUser } from './controllers.js';

const router = Router();

const url = config.get<string>('url');

registerGoogleAuth({
  callbackURL: `${url}/oauth/google/callback`,
  userFromProfile: async (profile) => {
    if (!profile.emails) {
      return null;
    }

    const email = profile.emails.find((email) => email.verified)?.value;

    if (!email) {
      return null;
    }
    let username = profile.displayName;

    const existingUser = await UserModel.findOne({ email });

    const googleProfile = {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails.map((email) => email.value),
      photos: profile.photos ? profile.photos.map((photo) => photo.value) : [],
    };

    if (existingUser) {
      existingUser.profiles.google = googleProfile;
      await existingUser.save();
      return existingUser;
    }

    const existingUserWithUsername = await UserModel.findOne({ username });

    if (existingUserWithUsername) {
      username = `${username}-${profile.id}`;
    }
    return await UserModel.create({
      username,
      email,
      profiles: {
        google: googleProfile,
      },
    });
  },
});

getRoute(router, '/', initiator());
getRoute(router, '/callback', callback(), createTokenFromUser);

export default router;
