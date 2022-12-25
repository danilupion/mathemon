import classNames from 'classnames';
import { ChangeEvent, useCallback } from 'react';

import { WithTransformations, WithValue } from '../common';
import withField, { WithFieldProps } from '../hocs/withField';
import withForm, { WithFormProps } from '../hocs/withForm';

import styles from './index.module.scss';

export type InputProps<Value> = Omit<JSX.IntrinsicElements['input'], 'value' | 'type'> & {
  type?: 'text' | 'number' | 'email' | 'password';
} & WithValue<Value> &
  (Value extends string ? Partial<WithTransformations<Value>> : WithTransformations<Value>);

const Input = <Value,>({
  className,
  value,
  onValueChange,
  decode,
  encode,
  ...props
}: InputProps<Value>) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange(decode ? decode(event.target.value) : (event.target.value as Value));
    },
    [decode, onValueChange],
  );

  return (
    <input
      {...props}
      className={classNames(styles.input, className)}
      value={encode ? encode(value) : (value as string)}
      onChange={handleChange}
    />
  );
};

export default Input;

export const InputField = withField(Input) as <Value>(
  props: WithFieldProps<InputProps<Value>>,
) => JSX.Element;

export const FormInput = withForm(Input) as <Value>(
  props: WithFormProps<InputProps<Value>>,
) => JSX.Element;

export const FormInputField = withField(FormInput) as <Value>(
  props: WithFieldProps<WithFormProps<InputProps<Value>>>,
) => JSX.Element;
