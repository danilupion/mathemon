import { localStorage } from '@mathemon/turbo-client/storage/index';
import { useCallback, useState } from 'react';

import Button from '../../components/Button';
import Modal from '../../components/Modal';

import styles from './index.module.scss';

const localStorageKey = 'cookies-accepted';

const CookiesModal = () => {
  const [accepted, setAccepted] = useState(localStorage.getItem(localStorageKey) === 'true');
  const acceptCookiesHandler = useCallback(() => {
    localStorage.setItem(localStorageKey, 'true');
    setAccepted(true);
  }, []);

  return accepted ? null : (
    <Modal className={styles.modal} open={true} data-testid="cookies-modal">
      <div className={styles.container}>
        <div>
          <img src="/icons/cookie.png" alt="cookie" />
        </div>
        <div className={styles.column}>
          <div>
            Utilizamos cookies para mejorar tu experiencia en nuestra web. Al navegar en ella,
            aceptas el uso de cookies de acuerdo a nuestra política de privacidad.
          </div>
          <div>
            <Button onClick={acceptCookiesHandler}>Aceptar</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CookiesModal;
