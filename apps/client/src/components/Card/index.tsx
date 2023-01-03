import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import styles from './index.module.scss';

type CardProps = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

const Card = ({ title, className, children }: CardProps) => {
  return (
    <div className={classNames(styles.container, { [styles['with-title']]: !!title }, className)}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
