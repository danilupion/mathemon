import { Score } from '@mathemon/common/models/operation';
import { Pokemon } from '@mathemon/common/models/pokemon';
import classNames from 'classnames';

import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import NavButton from '../../../components/NavButton';
import PokemonImage from '../../../components/PokemonImage';
import { useAuthStore } from '../../../hooks/useStore';

import styles from './index.module.scss';

interface FailureProps {
  score: Score;
  reward: Pokemon;
  onClose?: () => void;
  onRetry?: () => void;
}

const Failure = ({ score, onRetry, reward, onClose }: FailureProps) => (
  <>
    <div className={styles.sentiment}>¡Lo sentimos!</div>
    <div className={classNames(styles.score, styles.failure)}>
      {score.correct}/{score.total}
    </div>
    <div className={styles.answers}>respuestas correctas</div>
    <div className={classNames(styles.bottom, styles.failure)}>
      <PokemonImage pokemon={reward} />
      <div>
        Has encontrado a<div className={styles.name}>{reward.name}</div>
        <div>pero se ha escapado.</div>
      </div>
      <Button onClick={onRetry}>Reintentar</Button> <Button onClick={onClose}>Cerrar</Button>
    </div>
  </>
);

interface SuccessProps {
  score: Score;
  reward: Pokemon;
  onClose?: () => void;
}

const Success = ({ score, reward, onClose }: SuccessProps) => {
  const authStore = useAuthStore();

  return (
    <>
      <div className={styles.sentiment}>¡Enhorabuena!</div>
      <div className={classNames(styles.score, styles.success)}>
        {score.correct}/{score.total}
      </div>
      <div className={styles.answers}>respuestas correctas</div>
      <div className={classNames(styles.bottom, styles.success)}>
        <PokemonImage pokemon={reward} />
        <div>
          Has atrapado a<div className={styles.name}>{reward.name}</div>
          {!authStore.signedIn && (
            <div>* no se guardará en tu pokedex porque no has iniciado sesión</div>
          )}
        </div>
        {authStore.signedIn ? (
          <NavButton to="/pokedex">Pokedex</NavButton>
        ) : (
          <NavButton to="/signIn">Iniciar Sesión</NavButton>
        )}{' '}
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </>
  );
};

interface PrizeModalProps {
  open: boolean;
  score: Score;
  success: boolean;
  reward: Pokemon;
  onClose?: () => void;
  onRetry?: () => void;
}

const PrizeModal = ({ open, score, reward, success, onClose, onRetry }: PrizeModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      {success ? (
        <Success score={score} reward={reward} onClose={onClose} />
      ) : (
        <Failure score={score} reward={reward} onRetry={onRetry} onClose={onClose} />
      )}
    </Modal>
  );
};

export default PrizeModal;
