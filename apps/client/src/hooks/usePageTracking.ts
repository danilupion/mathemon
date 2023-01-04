import { pageview } from '@mathemon/turbo-client/analytics/google';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    pageview({ pathname: location.pathname });
  }, [location]);
};

export default usePageTracking;
