import { password } from '@danilupion/turbo-client/regex';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { changePassword } from '../../../api/profiles';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Form from '../../../components/Form';
import { FormInputField } from '../../../components/Form/Input';
import { ErrorMessage, SuccessMessage } from '../../../components/Message';

import styles from './index.module.scss';

const initialValues = {
  password: '',
  passwordConfirmation: '',
};

type ResetPasswordValues = typeof initialValues;

const ResetPassword = () => {
  const [passwordChanged, setPasswordChanged] = useState<boolean | undefined>(undefined);
  const { token } = useParams<{ token: string }>();

  const handleValidation = useCallback(async (values: ResetPasswordValues) => {
    const errors: Partial<ResetPasswordValues> = {};
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
    async (values: ResetPasswordValues) => {
      try {
        setPasswordChanged(undefined);
        await changePassword(token || '', values.password);
        setPasswordChanged(true);
      } catch (error) {
        setPasswordChanged(false);
      }
    },
    [setPasswordChanged, token],
  );

  if (!token) {
    return <ErrorMessage>Token inválido</ErrorMessage>;
  }

  return (
    <Card>
      <Form initialValues={initialValues} onSubmit={handleSubmission} validate={handleValidation}>
        {({ isSubmitting, isValid }) => (
          <>
            {passwordChanged === false && (
              <ErrorMessage>
                Ha ocurrido un error, prueba repitiendo el proceso de recuperación de contraseña.
              </ErrorMessage>
            )}
            {passwordChanged && <SuccessMessage>Contraseña cambiada con éxito</SuccessMessage>}

            <FormInputField<string>
              label="Password"
              type="password"
              name="password"
              disabled={isSubmitting || passwordChanged}
            />
            <FormInputField<string>
              label="Confirmación de password"
              type="password"
              name="passwordConfirmation"
              disabled={isSubmitting || passwordChanged}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || passwordChanged}
              className={styles.send}
              loading={isSubmitting}
            >
              Cambiar
            </Button>
          </>
        )}
      </Form>
    </Card>
  );
};

export default ResetPassword;
