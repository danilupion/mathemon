import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import styles from './index.module.scss';

type CardProps = PropsWithChildren<{
  title?: string;
}>;

const Card = ({ title, children }: CardProps) => {
  return (
    <div className={classNames(styles.container, { [styles['with-title']]: !!title })}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
