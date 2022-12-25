import { ComponentType } from 'react';

import styles from './withField.module.scss';

export type WithFieldProps<Props> = Props & {
  label?: string;
};

const withField = <Props,>(Component: ComponentType<Props>) => {
  const WithField = (props: WithFieldProps<Props>) => {
    return (
      <div className={styles.container}>
        <label>
          {props.label}
          <div>
            <Component {...props} />
          </div>
        </label>
      </div>
    );
  };

  return WithField;
};

export default withField;
