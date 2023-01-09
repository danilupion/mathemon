import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import Loader from '../Loader';

import styles from './index.module.scss';

type ButtonProps = PropsWithChildren<JSX.IntrinsicElements['button']> & {
  loading?: boolean;
};

const Button = ({ children, loading, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={classNames(className, styles.button, { [styles.loading]: loading })}
    >
      {loading && <Loader className={styles.loader} />}
      {typeof children === 'string' ? <span>{children}</span> : children}
    </button>
  );
};

export default Button;
