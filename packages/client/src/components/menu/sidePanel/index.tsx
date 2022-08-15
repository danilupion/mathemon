import classNames from 'classnames';
import { PropsWithChildren, useEffect } from 'react';

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
  useEffect(() => {
    const body = document.querySelector('body') as HTMLBodyElement;
    if (open) {
      body.classList.add('noscroll');
    } else {
      body.classList.remove('noscroll');
    }
  }, [open]);

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
