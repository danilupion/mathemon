import { Formik, Form as FormikForm } from 'formik';
import { FormikConfig, FormikProps, FormikValues } from 'formik/dist/types';

type FormProps<Values extends FormikValues> = Omit<FormikConfig<Values>, 'component' | 'render'>;

const Form = <Values extends FormikValues>({ children, ...props }: FormProps<Values>) => {
  return (
    <Formik {...props}>
      {typeof children === 'function'
        ? (props: FormikProps<Values>) => {
            return <FormikForm noValidate={true}>{children(props)}</FormikForm>;
          }
        : children}
    </Formik>
  );
};

export default Form;
