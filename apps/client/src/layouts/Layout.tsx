import { Outlet } from 'react-router-dom';

import Header from '../components/Header';

import CookiesModal from './CookiesModal';
import styles from './Layout.module.scss';

const Layout = () => {
  return (
    <>
      <Header />
      <div className={styles.content}>
        <Outlet />
      </div>
      <CookiesModal />
    </>
  );
};

export default Layout;
