import { createContext, useContext } from 'react';

import { AuthStore } from '../stores/authStore';
import { SettingsStore } from '../stores/settingsStore';

interface StoreContext {
  authStore: AuthStore;
  settingsStore: SettingsStore;
}

const storeContext = createContext<StoreContext>({
  authStore: new AuthStore(),
  settingsStore: new SettingsStore(),
});

const useStore = () => useContext(storeContext);

export default useStore;

export const useAuthStore = () => useContext(storeContext).authStore;

export const useSettingsStore = () => useContext(storeContext).settingsStore;
