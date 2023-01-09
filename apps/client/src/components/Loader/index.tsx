import classNames from 'classnames';
import { useLayoutEffect, useRef } from 'react';

import styles from './index.module.scss';

type LoaderProps = {
  className?: string;
};
const Loader = ({ className }: LoaderProps) => {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (container.current) {
      container.current
        .querySelector<HTMLDivElement>(`.${styles.loader}`)
        ?.style.setProperty(
          'transform',
          `scale(${container.current.clientWidth / 70}, ${container.current.clientHeight / 70})`,
        );
    }
  }, []);

  return (
    <div className={classNames(styles.container, className)} ref={container}>
      <div className={styles.loader} />
    </div>
  );
};

export default Loader;
