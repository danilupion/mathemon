import { Outlet } from 'react-router-dom';

import CookiesModal from './CookiesModal';

const HeadlessLayout = () => {
  return (
    <>
      <Outlet />
      <CookiesModal />
    </>
  );
};

export default HeadlessLayout;
