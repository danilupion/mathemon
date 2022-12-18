import { Outlet } from 'react-router-dom';

import Menu from '../components/Menu';

import styles from './Layout.module.scss';

const Layout = () => {
  return (
    <>
      <Menu />
      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
