import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../hooks/useStore';

const NotSignedInGuard = observer(() => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const signedIn = !!user;

  useEffect(() => {
    if (signedIn) {
      navigate(-1);
    }
  });

  return !signedIn ? <Outlet /> : null;
});

export default NotSignedInGuard;
