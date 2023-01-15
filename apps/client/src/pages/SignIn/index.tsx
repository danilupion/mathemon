import { NavLink, useSearchParams } from 'react-router-dom';

import { ErrorMessage, SuccessMessage } from '../../components/Message';
import TabPanel from '../../components/TabPanel';

import ForgottenPassword from './ForgottenPassword';
import LogIn from './LogIn';
import Register from './Register';
import ResetPassword from './ResetPassword';
import styles from './index.module.scss';

export enum SignInSection {
  SignInAndRegister = 'sign-in-and-register',
  ForgottenPassword = 'forgotten-password',
  ResetPassword = 'reset-password',
}

interface SignInProps {
  section?: SignInSection;
}

const Content = ({ section }: { section: SignInSection }) => {
  switch (section) {
    case SignInSection.SignInAndRegister:
      return (
        <TabPanel>
          <TabPanel.Tab label="Iniciar sesión">
            <LogIn />
          </TabPanel.Tab>
          <TabPanel.Tab label="Registro">
            <Register />
          </TabPanel.Tab>
        </TabPanel>
      );
    case SignInSection.ForgottenPassword:
      return <ForgottenPassword />;
    case SignInSection.ResetPassword:
      return <ResetPassword />;
  }
};

const SignIn = ({ section = SignInSection.SignInAndRegister }: SignInProps) => {
  const [searchParams] = useSearchParams();
  let message = null;
  if (searchParams.has('emailValidation')) {
    if (searchParams.get('emailValidation') === 'true') {
      message = <SuccessMessage>Email verificado, ya puedes iniciar sesión.</SuccessMessage>;
    } else {
      message = (
        <ErrorMessage>Hubo algún error verificando el email, preuba otra vez.</ErrorMessage>
      );
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.logo}>
          <NavLink to="/">Mathemon</NavLink>
        </h1>
        {message}
        <Content section={section} />
      </div>
    </div>
  );
};

export default SignIn;
