import { ChangeEvent, useCallback } from 'react';

import styles from './index.module.scss';

interface FieldProps<T> {
  label?: string;
  value: T;
  options: T[] | [string, T][];
  onChange?: (value: T) => void;
  parser?: (value: string) => T;
}

const defaultProps = {
  parser: (value: string) => value,
};

const Select = <T extends string | number | undefined>({
  label,
  value,
  options,
  onChange,
  parser,
}: FieldProps<T>) => {
  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      onChange && parser && onChange(parser(ev.target.value));
    },
    [onChange, parser],
  );
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.select}>
        <select id="success_select" value={value} onChange={handleOnChange}>
          {options.map((v, index) => (
            <option key={index} value={Array.isArray(v) ? v[1] : v}>
              {Array.isArray(v) ? v[0] : v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

Select.defaultProps = defaultProps;

export default Select;
