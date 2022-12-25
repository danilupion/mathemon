import { ChangeEvent, useCallback } from 'react';

import { WithTransformations, WithValue } from '../common';
import withField, { WithFieldProps } from '../hocs/withField';
import withForm, { WithFormProps } from '../hocs/withForm';

import styles from './index.module.scss';

export type SelectProps<Value> = Omit<JSX.IntrinsicElements['select'], 'value'> &
  WithValue<Value> & {
    options: Array<Value | [string, Value]>;
  } & (Value extends string ? Partial<WithTransformations<Value>> : WithTransformations<Value>);

const Select = <Value,>({
  className,
  options,
  value,
  onValueChange,
  decode,
  encode,
  ...props
}: SelectProps<Value>) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onValueChange(decode ? decode(event.target.value) : (event.target.value as Value));
    },
    [decode, onValueChange],
  );

  const doEncode = useCallback(
    (value: Value): string => (encode ? encode(value) : value) as string,
    [encode],
  );

  return (
    <div className={styles.select}>
      <select {...props} value={doEncode(value)} onChange={handleChange} className={className}>
        {options.map((v, index) => (
          <option key={index} value={Array.isArray(v) ? doEncode(v[1]) : doEncode(v)}>
            {Array.isArray(v) ? v[0] : doEncode(v)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

export const SelectField = withField(Select) as <Value>(
  props: WithFieldProps<SelectProps<Value>>,
) => JSX.Element;

export const FormSelect = withForm(Select) as <Value>(
  props: WithFormProps<SelectProps<Value>>,
) => JSX.Element;

export const FormSelectField = withField(FormSelect) as <Value>(
  props: WithFieldProps<WithFormProps<SelectProps<Value>>>,
) => JSX.Element;
