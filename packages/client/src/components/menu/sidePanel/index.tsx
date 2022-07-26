import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import styles from './index.module.scss';

export enum Side {
  Left = 'left',
  Right = 'right',
}

type SidePanelProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  side?: Side;
}>;

const SidePanel = ({ open, onClose, children, side = Side.Left }: SidePanelProps) => {
  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <div
        className={classNames(styles.panel, {
          [styles.open]: open,
          [styles.left]: side === Side.Left,
          [styles.right]: side === Side.Right,
        })}
      >
        {children}
      </div>
    </>
  );
};

export default SidePanel;
