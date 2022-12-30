import { CreateProfileReq, CreateProfileRes } from '@mathemon/common/models/api/profiles.js';
import controller from '@mathemon/turbo-server/helpers/express/controller.js';
import { ClientErrorConflict } from '@mathemon/turbo-server/helpers/httpError.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';

import UserModel from '../../../models/user.js';

export const createProfile = controller<CreateProfileReq, CreateProfileRes>(async (req, res) => {
  const existingUser = await UserModel.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });

  if (existingUser) {
    throw new ClientErrorConflict();
  }

  res.status(StatusCode.SuccessCreated).send({
    success: !!(await UserModel.create({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    })),
  });
});
