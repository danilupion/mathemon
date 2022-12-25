import { UserRole } from '@mathemon/common/models/user';
import { Form, Formik } from 'formik';
import { useCallback, useState } from 'react';

import { FormCheckboxField } from '../../components/Form/Checkbox';
import { FormInputField } from '../../components/Form/Input';
import { useAuthStore } from '../../hooks/useStore';

import styles from './index.module.scss';

const initialValues = {
  email: '',
  password: '',
  role: UserRole.user,
  rememberMe: false,
};

type SignInValues = typeof initialValues;

const SignIn = () => {
  const [loginError, setLoginError] = useState<boolean>(false);
  const authStore = useAuthStore();

  const handleSubmission = useCallback(
    async (values: SignInValues) => {
      try {
        setLoginError(false);
        setLoginError(!(await authStore.signIn(values.email, values.password, values.rememberMe)));
      } catch (error) {
        setLoginError(true);
      }
    },
    [setLoginError, authStore],
  );

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <div className={styles.formContainer}>
          <h1 className={styles.logo}>Mathemon</h1>
          <Formik initialValues={initialValues} onSubmit={handleSubmission}>
            {({ isSubmitting }) => (
              <Form>
                {loginError && <h4>Revisa tu usuario y contraseña</h4>}
                <FormInputField<string> label="Email" type="email" name="email" />
                <FormInputField<string> label="Password" type="password" name="password" />
                <FormCheckboxField name="rememberMe" text="Recuérdame" />
                <button type="submit" disabled={isSubmitting}>
                  Entrar
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
