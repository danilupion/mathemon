import { Pokemon } from '@mathemon/common/models/pokemon';
import classNames from 'classnames';

import Card from '../../../components/Card';
import PokemonImage from '../../../components/PokemonImage';

import styles from './index.module.scss';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Card
      key={pokemon.id}
      title={`#${pokemon.number}: ${pokemon.name}`}
      className={styles.container}
    >
      <div className={styles.images}>
        <PokemonImage
          pokemon={pokemon}
          className={classNames({ [styles.unknown]: pokemon.name === '???' })}
        />
      </div>
    </Card>
  );
};

export default PokemonCard;
