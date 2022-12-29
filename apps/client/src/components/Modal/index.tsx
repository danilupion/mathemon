import classNames from 'classnames';
import { PropsWithChildren, ReactEventHandler, useCallback, useEffect, useRef } from 'react';

import styles from './index.module.scss';

type DialogProps = PropsWithChildren<Omit<JSX.IntrinsicElements['dialog'], 'onCancel'>>;

const Modal = ({ children, open, className, ...props }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const { current } = dialogRef;
    if (current) {
      console.log(current);
      if (open) {
        !current.open && current.showModal();
      } else {
        current.close();
      }
    }
  }, [open]);

  const handleCancel: ReactEventHandler<HTMLDialogElement> = useCallback((ev) => {
    ev.preventDefault();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      className={classNames(styles.dialog, className)}
      {...props}
    >
      {children}
    </dialog>
  );
};

export default Modal;
