import { email } from '@danilupion/turbo-client/regex';
import { AccountRes } from '@mathemon/common/models/api/me';
import { useCallback, useEffect, useState } from 'react';

import { getAccount, updateAccount } from '../../../api/me';
import Button from '../../../components/Button';
import Form from '../../../components/Form';
import { FormInputField } from '../../../components/Form/Input';
import Loader from '../../../components/Loader';

import styles from './index.module.scss';

const ProfileForm = () => {
  const [status, setStatus] = useState<'success' | 'error' | undefined>(undefined);
  const [account, setAccount] = useState<AccountRes | undefined>();

  useEffect(() => {
    getAccount().then(setAccount);
  }, []);

  const handleSubmission = useCallback(async (values: AccountRes) => {
    try {
      await updateAccount(values.username, values.email);
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  }, []);

  const handleValidation = useCallback((values: AccountRes) => {
    const errors: Partial<AccountRes> = {};
    if (!values.email.match(email)) {
      errors.email = 'Email inválido';
    }
    return errors;
  }, []);

  return !account ? (
    <Loader />
  ) : (
    <Form initialValues={account} onSubmit={handleSubmission} validate={handleValidation}>
      {({ isSubmitting, isValid }) => (
        <>
          {status === 'success' && <h4>Perfil actualizado con éxito</h4>}
          {status === 'error' && (
            <h4>
              Hubo un error al actualizar el perfil, prueba con otro email o nombre de usuario
            </h4>
          )}
          <FormInputField<string> label="Email" type="email" name="email" disabled={isSubmitting} />
          <FormInputField<string>
            label="Nombre de usuario"
            type="text"
            name="username"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
            className={styles.send}
          >
            Actualizar
          </Button>
        </>
      )}
    </Form>
  );
};

export default ProfileForm;
