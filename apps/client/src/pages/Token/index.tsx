import { Navigate, useSearchParams } from 'react-router-dom';

import { useAuthStore } from '../../hooks/useStore';

const Token = () => {
  const [searchParams] = useSearchParams();
  const authStore = useAuthStore();

  if (searchParams.has('token')) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    authStore.setToken(searchParams.get('token')!);
  }

  return <Navigate to={authStore.token ? '/' : '/signIn'} replace />;
};

export default Token;
