import controller, {
  RequestWithFields,
} from '@danilupion/turbo-server/helpers/express/controller.js';
import { ClientErrorUnauthorized } from '@danilupion/turbo-server/helpers/httpError.js';
import { generateToken } from '@danilupion/turbo-server/middleware/express/auth/jwt.js';
import { OauthProfile } from '@danilupion/turbo-server/middleware/express/oauth/index.js';

import UserModel, { UserDocument } from '../../models/user.js';
import { getTokenPayload } from '../../utils/auth.js';

type UserFiled = {
  user?: UserDocument;
};

export const createTokenFromUser = controller<RequestWithFields<UserFiled>>(async (req, res) => {
  if (!req.user) {
    throw new ClientErrorUnauthorized();
  }

  res.cookie('token', await generateToken(getTokenPayload(req.user)), {
    secure: true,
  });

  res.redirect('/');
});

export const userFromProfile =
  <Profile extends OauthProfile>(
    field: keyof UserDocument['profiles'],
    emailGetter: (profile: Profile) => string | undefined,
  ) =>
  async (profile: Profile) => {
    if (!profile.emails || !profile.emails.length) {
      return null;
    }

    const email = emailGetter(profile);

    if (!email) {
      return null;
    }
    let username = profile.displayName;

    const existingUser = await UserModel.findOne({ email });

    const profileField = {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails.map((email) => email.value),
      photos: profile.photos ? profile.photos.map((photo) => photo.value) : [],
    };

    if (existingUser) {
      existingUser.profiles[field] = profileField;
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
      verified: true,
      profiles: {
        [field]: profileField,
      },
    });
  };
