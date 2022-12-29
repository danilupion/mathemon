import classNames from 'classnames';
import { ChangeEvent, useCallback } from 'react';

import { WithValue } from '../common';
import withField from '../hocs/withField';
import withForm, { WithFormProps } from '../hocs/withForm';

import styles from './index.module.scss';

export type CheckboxProps = Omit<JSX.IntrinsicElements['input'], 'value'> &
  WithValue<boolean> & {
    text?: string;
  };
const Checkbox = ({ text, className, value, onChange, onValueChange, ...props }: CheckboxProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(event);

      onValueChange && onValueChange(event.target.checked);
    },
    [onChange, onValueChange],
  );

  return (
    <label>
      <input
        {...props}
        type="checkbox"
        checked={value}
        onChange={handleChange}
        className={classNames(styles.checkbox, className)}
      />
      <span>{text}</span>
    </label>
  );
};

export default Checkbox;

export const CheckboxField = withField<CheckboxProps>(Checkbox);

export const FormCheckbox = withForm<boolean, CheckboxProps>(Checkbox);

export const FormCheckboxField = withField<WithFormProps<CheckboxProps>>(FormCheckbox);
