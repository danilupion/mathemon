import { email, password } from '@mathemon/turbo-client/regex';
import { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../../components/Button';
import Form from '../../../components/Form';
import { FormCheckboxField } from '../../../components/Form/Checkbox';
import { FormInputField } from '../../../components/Form/Input';
import NavButton from '../../../components/NavButton';
import { useAuthStore } from '../../../hooks/useStore';

import styles from './index.module.scss';

const initialValues = {
  email: '',
  password: '',
  rememberMe: false,
};

type SignInValues = typeof initialValues;

const LogIn = () => {
  const [loginError, setLoginError] = useState<boolean>(false);
  const authStore = useAuthStore();

  const handleValidation = useCallback(async (values: SignInValues) => {
    const errors: Partial<SignInValues> = {};
    if (!values.email.match(email)) {
      errors.email = 'Email inválido';
    }
    if (!values.password.match(password)) {
      errors.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial';
    }

    return errors;
  }, []);

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
    <div>
      <Form initialValues={initialValues} onSubmit={handleSubmission} validate={handleValidation}>
        {({ isSubmitting, isValid }) => (
          <>
            {loginError && <h4>Revisa tu usuario y contraseña</h4>}
            <FormInputField<string> label="Email" type="email" name="email" />
            <FormInputField<string> label="Password" type="password" name="password" />
            <FormCheckboxField name="rememberMe" text="Recuérdame" />
            <div className={styles['forgotten-password']}>
              <NavLink to="/signIn/forgotten-password">Olvidé mi contraseña</NavLink>
            </div>
            <div className={styles.buttons}>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={styles.send}
                loading={isSubmitting}
              >
                Entrar
              </Button>
              <NavButton href="/oauth/google" native>
                <i className={styles.google} />
              </NavButton>
              <NavButton href="/oauth/facebook" native>
                <i className={styles.facebook} />
              </NavButton>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default LogIn;
