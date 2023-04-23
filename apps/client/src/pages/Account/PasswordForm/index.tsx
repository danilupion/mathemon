import { password } from '@danilupion/turbo-client/regex';
import { useCallback, useState } from 'react';

import { updatePassword } from '../../../api/me';
import Button from '../../../components/Button';
import Form from '../../../components/Form';
import { FormInputField } from '../../../components/Form/Input';

import styles from './index.module.scss';

const initialValues = {
  password: '',
  passwordConfirmation: '',
};

type PasswordValues = typeof initialValues;

const PasswordForm = () => {
  const [status, setStatus] = useState<'success' | 'error' | undefined>(undefined);

  const handleSubmission = useCallback(async (values: PasswordValues) => {
    try {
      await updatePassword(values.password);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }, []);

  const handleValidation = useCallback((values: PasswordValues) => {
    const errors: Partial<PasswordValues> = {};
    if (!values.password.match(password)) {
      errors.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial';
    }
    if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation = 'Las contraseñas no coinciden';
    }
    return errors;
  }, []);

  return (
    <Form initialValues={initialValues} onSubmit={handleSubmission} validate={handleValidation}>
      {({ isSubmitting, isValid }) => (
        <>
          {status === 'success' && <h4>Contraseña actualizada con éxito</h4>}
          {status === 'error' && <h4>Hubo un error al actualizar la contraseña</h4>}
          <FormInputField<string>
            label="Password"
            type="password"
            name="password"
            disabled={isSubmitting}
          />
          <FormInputField<string>
            label="Confirmación de password"
            type="password"
            name="passwordConfirmation"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={styles.send}
            loading={isSubmitting}
          >
            Cambiar
          </Button>
        </>
      )}
    </Form>
  );
};

export default PasswordForm;
