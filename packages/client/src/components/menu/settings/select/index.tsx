import { ChangeEvent, useCallback } from 'react';

import styles from './index.module.scss';

interface FieldProps {
  label?: string;
  value: number;
  options: number[];
  onChange?: (value: number) => void;
}

const Select = ({ label, value, options, onChange }: FieldProps) => {
  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      onChange && onChange(Number(ev.target.value));
    },
    [onChange],
  );
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.select}>
        <select id="success_select" value={value} onChange={handleOnChange}>
          {options.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
