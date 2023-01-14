import { UserRole } from '@mathemon/common/models/user.js';
import {
  connectMongoose,
  disconnectMongoose,
} from '@mathemon/turbo-server/helpers/mongoose/connection.js';
import chalk from 'chalk';
import { BuilderCallback } from 'yargs';

import UserModel from '../../models/user.js';

type CreateUserOptions = {
  username: string;
  email: string;
  password: string;
  admin: boolean;
};

export const command = 'user-create <email> <username> <password> [-a]';

export const describe = 'creates a user';

export const builder: BuilderCallback<CreateUserOptions, CreateUserOptions> = (yargs) =>
  yargs
    .positional('email', {
      describe: 'Email to be used',
      type: 'string',
    })
    .positional('username', {
      describe: 'Username to be used',
      type: 'string',
    })
    .positional('password', {
      describe: 'Password to be used',
      type: 'string',
    })
    .option('admin', {
      alias: 'a',
      default: false,
      describe: 'Should the user be admin?',
    });

export const handler = async (argv: CreateUserOptions) => {
  const { username, email, password, admin } = argv;

  try {
    await connectMongoose();
    await UserModel.create({
      username: username as string,
      email: email as string,
      password: password as string,
      role: admin ? UserRole.admin : UserRole.user,
      created: new Date(),
    });
    console.log(chalk.green(`${chalk.bold('[User:CREATED]')} ${username}`));
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red(`${chalk.bold('[User:FAILED]')} ${username}: ${e.message}`));
    }
  } finally {
    await disconnectMongoose();
  }
};
