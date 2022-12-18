import { ChangeEvent, useCallback } from 'react';

import styles from './index.module.scss';

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onChange?: (value: boolean) => void;
}

const Checkbox = ({ label, checked, onChange }: CheckBoxProps) => {
  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(ev.target.checked);
    },
    [onChange],
  );

  return (
    <div className={styles.field}>
      <label>
        <input type="checkbox" checked={checked} onChange={handleOnChange} />
        <span>{label}</span>
      </label>
    </div>
  );
};

export default Checkbox;
