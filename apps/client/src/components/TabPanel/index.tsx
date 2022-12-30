import classNames from 'classnames';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import Button from '../Button';

import Tab from './Tab';
import TabPanelContext, { Activator, TabPanelContextProps } from './context';
import styles from './index.module.scss';

type TabPanelProps = PropsWithChildren;

const TabPanel = ({ children }: TabPanelProps) => {
  const [tabs, setTabs] = useState<[string, Activator][]>([]);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const setActiveLabel = useCallback(
    (label: string) => () => {
      tabs.forEach(([tab, activator]) => {
        activator(tab === label);
        if (tab === label) {
          setActiveTab(tab);
        }
      });
    },
    [tabs],
  );

  useEffect(() => {
    if (activeTab && !tabs.find(([tab]) => tab === activeTab)) {
      setActiveTab(undefined);
    }
    if (tabs.length > 0 && !activeTab) {
      setActiveLabel(tabs[0][0])();
    }
  }, [activeTab, setActiveLabel, tabs]);

  const tabPanelContext = useMemo<TabPanelContextProps>(() => {
    return {
      registerTab: (tab: string, activator: Activator) => {
        setTabs((tabs) => [...tabs, [tab, activator]]);
      },
      unregisterTab: (tab: string) => {
        setTabs((tabs) => tabs.filter(([t]) => t !== tab));
      },
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map(([label]) => (
          <Button
            key={label}
            onClick={setActiveLabel(label)}
            className={classNames({ [styles.active]: activeTab === label })}
          >
            {label}
          </Button>
        ))}
      </div>
      <TabPanelContext.Provider value={tabPanelContext}>{children}</TabPanelContext.Provider>
    </div>
  );
};

TabPanel.Tab = Tab;

export default TabPanel;
