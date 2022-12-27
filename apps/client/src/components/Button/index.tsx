import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import styles from './index.module.scss';

type ButtonProps = PropsWithChildren<JSX.IntrinsicElements['button']>;

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button {...props} className={classNames(className, styles.button)}>
      {children}
    </button>
  );
};

export default Button;
