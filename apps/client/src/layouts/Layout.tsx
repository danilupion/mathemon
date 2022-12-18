import { Outlet } from 'react-router-dom';

import Menu from '../components/menu';

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
