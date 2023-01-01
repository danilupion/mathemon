import { observer } from 'mobx-react-lite';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '../hooks/useStore';

type NotSignedInGuardProps = {
  redirect?: string;
};

const NotSignedInGuard = observer(({ redirect = '/' }: NotSignedInGuardProps) => {
  const { user } = useAuthStore();

  const signedIn = !!user;

  return !signedIn ? <Outlet /> : <Navigate to={redirect} replace />;
});

export default NotSignedInGuard;
