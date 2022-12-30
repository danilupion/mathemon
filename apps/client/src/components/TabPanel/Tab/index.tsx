import { PropsWithChildren, useContext, useEffect, useState } from 'react';

import TabPanelContext from '../context';

import styles from './index.module.scss';

type TabProps = PropsWithChildren<{
  label: string;
}>;

const Tab = ({ children, label }: TabProps) => {
  const [active, setActive] = useState(false);
  const tabPanelContext = useContext(TabPanelContext);

  useEffect(() => {
    tabPanelContext && tabPanelContext.registerTab(label, setActive);

    return () => {
      tabPanelContext && tabPanelContext.unregisterTab(label);
    };
  }, [label, tabPanelContext]);

  return active ? <div className={styles.container}>{children}</div> : null;
};

export default Tab;
