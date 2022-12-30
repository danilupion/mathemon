import { NavLink } from 'react-router-dom';

import TabPanel from '../../components/TabPanel';

import LogIn from './LogIn';
import Register from './Register';
import styles from './index.module.scss';

const SignIn = () => {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.logo}>
          <NavLink to="/">Mathemon</NavLink>
        </h1>
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
