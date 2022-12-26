import { Outlet } from 'react-router-dom';

import Header from '../components/Header';

import styles from './Layout.module.scss';

const Layout = () => {
  return (
    <>
      <Header />
      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
