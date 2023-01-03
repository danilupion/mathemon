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

  onClose?: () => void;
  onRetry?: () => void;
}

const Failure = ({ score, onRetry, onClose }: FailureProps) => (
  <>
    <div className={styles.sentiment}>¡Lo sentimos!</div>
    <div className={classNames(styles.score, styles.failure)}>
      {score.correct}/{score.total}
    </div>
    <div className={styles.answers}>respuestas correctas</div>
    <div className={classNames(styles.bottom, styles.failure)}>
      <div>No has conseguido ningún Pokémon</div>
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
          Has conseguido a <span className={styles.name}>{reward.name}</span>{' '}
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
  reward?: Pokemon;
  onClose?: () => void;
  onRetry?: () => void;
}

const PrizeModal = ({ open, score, reward, onClose, onRetry }: PrizeModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      {reward ? (
        <Success score={score} reward={reward} onClose={onClose} />
      ) : (
        <Failure score={score} onRetry={onRetry} onClose={onClose} />
      )}
    </Modal>
  );
};

export default PrizeModal;
