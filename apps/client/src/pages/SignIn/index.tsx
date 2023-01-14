import { NavLink, useSearchParams } from 'react-router-dom';

import { ErrorMessage, SuccessMessage } from '../../components/Message';
import TabPanel from '../../components/TabPanel';

import LogIn from './LogIn';
import Register from './Register';
import styles from './index.module.scss';

const SignIn = () => {
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
        <TabPanel>
          <TabPanel.Tab label="Iniciar sesión">
            <LogIn />
          </TabPanel.Tab>
          <TabPanel.Tab label="Registro">
            <Register />
          </TabPanel.Tab>
        </TabPanel>
      </div>
    </div>
  );
};

export default SignIn;
