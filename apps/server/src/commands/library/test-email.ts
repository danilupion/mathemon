import { sendEmail } from '@danilupion/turbo-server/helpers/email.js';
import chalk from 'chalk';
import { BuilderCallback } from 'yargs';

type TestEmailOptions = {
  email: string;
};

export const command = 'test-email <email>';

export const describe = 'sends a test email';

export const builder: BuilderCallback<TestEmailOptions, TestEmailOptions> = (yargs) =>
  yargs.positional('email', {
    describe: 'Email to send the test email to',
    type: 'string',
  });

export const handler = async (argv: TestEmailOptions) => {
  const { email } = argv;

  try {
    const result = await sendEmail({
      to: email,
      subject: 'Test Email',
      text: 'This is a test email',
      html: '<p>This is a test email</p>',
    });
    console.log(chalk.green(`${chalk.bold('[Email:SENT]')} ${JSON.stringify(result)}`));
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red(`${chalk.bold('[Email:FAILED]')}: ${e.message}`));
    }
  }
};
