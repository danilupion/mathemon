import { Score } from '@mathemon/common/models/operation';
import { Pokemon } from '@mathemon/common/models/pokemon';
import classNames from 'classnames';

import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import NavButton from '../../../components/NavButton';
import PokemonImage from '../../../components/PokemonImage';

import styles from './index.module.scss';

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
      <div className={styles.sentiment}>{reward ? '!Enhorabuena!' : '!Lo sentimos!'}</div>
      <div
        className={classNames(styles.score, {
          [styles.success]: !!reward,
          [styles.failure]: !reward,
        })}
      >
        {score.correct}/{score.total}
      </div>
      <div className={styles.answers}>respuestas correctas</div>
      {reward ? (
        <div className={classNames(styles.bottom, styles.success)}>
          <PokemonImage pokemon={reward} />
          <div>
            Has conseguido a <span className={styles.name}>{reward.name}</span>
          </div>
          <NavButton to="/pokedex">Pokedex</NavButton> <Button onClick={onClose}>Cerrar</Button>
        </div>
      ) : (
        <div className={classNames(styles.bottom, styles.failure)}>
          <div>No has conseguido ningún Pokémon</div>
          <Button onClick={onRetry}>Reintentar</Button> <Button onClick={onClose}>Cerrar</Button>
        </div>
      )}
    </Modal>
  );
};

export default PrizeModal;
