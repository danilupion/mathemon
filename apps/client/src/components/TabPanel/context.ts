import { createContext } from 'react';

export type Activator = (active: boolean) => void;

export type TabPanelContextProps = {
  registerTab: (tab: string, activator: Activator) => void;
  unregisterTab: (tab: string) => void;
};

export default createContext<TabPanelContextProps | null>(null);
