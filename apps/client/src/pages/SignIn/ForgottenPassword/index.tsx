import { email } from '@danilupion/turbo-client/regex';
import { useCallback, useState } from 'react';

import { createPasswordResetToken } from '../../../api/profiles';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Form from '../../../components/Form';
import { FormInputField } from '../../../components/Form/Input';
import { ErrorMessage, SuccessMessage } from '../../../components/Message';

import styles from './index.module.scss';

const initialValues = {
  email: '',
};

type ForgottenPasswordValues = typeof initialValues;

const ForgottenPassword = () => {
  const [tokenCreated, setTokenCreated] = useState<boolean | undefined>(undefined);

  const handleValidation = useCallback(async (values: ForgottenPasswordValues) => {
    const errors: Partial<ForgottenPasswordValues> = {};
    if (!values.email.match(email)) {
      errors.email = 'Email inválido';
    }

    return errors;
  }, []);

  const handleSubmission = useCallback(
    async (values: ForgottenPasswordValues) => {
      try {
        setTokenCreated(undefined);
        await createPasswordResetToken(values.email);
        setTokenCreated(true);
      } catch (error) {
        setTokenCreated(false);
      }
    },
    [setTokenCreated],
  );

  return (
    <Card>
      <Form initialValues={initialValues} onSubmit={handleSubmission} validate={handleValidation}>
        {({ isSubmitting, isValid }) => (
          <>
            <h3>Recuperacion de contraseña</h3>
            {tokenCreated === false && (
              <ErrorMessage>Ocurrió un error, reintenta más tarde.</ErrorMessage>
            )}
            {tokenCreated && (
              <SuccessMessage>
                Si el email que proporcionaste está dado de alta, recibirás un correo con el link
                para cambiar la contraseña.
              </SuccessMessage>
            )}
            <FormInputField<string> label="Email" type="email" name="email" />
            <div className={styles.buttons}>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || tokenCreated}
                className={styles.send}
                loading={isSubmitting}
              >
                Enviar
              </Button>
            </div>
          </>
        )}
      </Form>
    </Card>
  );
};

export default ForgottenPassword;
