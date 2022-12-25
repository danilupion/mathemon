import { useField } from 'formik';
import { ComponentType } from 'react';

import { WithValue } from '../common';

export type WithFormProps<Props> = Omit<Props, 'value' | 'onValueChange'> & {
  name: string;
};

const withForm = <Value, Props extends JSX.IntrinsicAttributes & WithValue<Value>>(
  Component: ComponentType<Props>,
) => {
  const WithForm = (props: WithFormProps<Props>) => {
    const [{ value }, , { setValue }] = useField<Value>(props);

    return (
      <Component
        {...({
          value,
          onValueChange: setValue,
          ...props,
        } as unknown as Props)}
      />
    );
  };

  return WithForm;
};

export default withForm;
