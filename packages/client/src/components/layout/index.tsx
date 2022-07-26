import { Outlet } from 'react-router-dom';

import Menu from '../menu';

import styles from './index.module.scss';

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
