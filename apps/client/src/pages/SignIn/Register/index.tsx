import { email, password } from '@mathemon/turbo-client/regex';
import { useCallback, useState } from 'react';

import { createProfile } from '../../../api/profiles';
import Button from '../../../components/Button';
import Form from '../../../components/Form';
import { FormInputField } from '../../../components/Form/Input';

import styles from './index.module.scss';

const initialValues = {
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
};

type RegisterValues = typeof initialValues;
const Register = () => {
  const [profileCreated, setProfileCreated] = useState<boolean | undefined>(undefined);

  const handleValidation = useCallback(async (values: RegisterValues) => {
    const errors: Partial<RegisterValues> = {};
    if (!values.email.match(email)) {
      errors.email = 'Email inválido';
    }
    if (!values.password.match(password)) {
      errors.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial';
    }
    if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation = 'Las contraseñas no coinciden';
    }
    return errors;
  }, []);

  const handleSubmission = useCallback(
    async (values: RegisterValues) => {
      try {
        setProfileCreated(undefined);
        setProfileCreated(!!(await createProfile(values.username, values.email, values.password)));
      } catch (error) {
        setProfileCreated(false);
      }
    },
    [setProfileCreated],
  );

  return (
    <Form initialValues={initialValues} onSubmit={handleSubmission} validate={handleValidation}>
      {({ isSubmitting, isValid }) => (
        <>
          {profileCreated === false && <h4>Revisa el correo, el usuario y la contraseña.</h4>}
          {profileCreated && <h4>Perfil creado con éxito</h4>}
          <FormInputField<string>
            label="Email"
            type="email"
            name="email"
            disabled={profileCreated}
          />
          <FormInputField<string>
            label="Nombre de usuario"
            type="text"
            name="username"
            disabled={profileCreated}
          />
          <FormInputField<string>
            label="Password"
            type="password"
            name="password"
            disabled={profileCreated}
          />
          <FormInputField<string>
            label="Confirmación de password"
            type="password"
            name="passwordConfirmation"
            disabled={profileCreated}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !isValid || profileCreated}
            className={styles.send}
            loading={isSubmitting}
          >
            Registrar
          </Button>
        </>
      )}
    </Form>
  );
};

export default Register;
