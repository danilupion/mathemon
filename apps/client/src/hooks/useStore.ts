import { createContext, useContext } from 'react';

import { AuthStore } from '../stores/authStore';

interface StoreContext {
  authStore: AuthStore;
}

const storeContext = createContext<StoreContext>({
  authStore: new AuthStore(),
});

const useStore = () => useContext(storeContext);

export default useStore;

export const useAuthStore = () => useContext(storeContext).authStore;
