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
    <Card key={pokemon.id} title={pokemon.number.toString()}>
      <table className={styles['pokemon-stats']}>
        <tbody>
          <tr>
            <td>Nombre: </td>
            <td>
              <b>{pokemon.name}</b>
            </td>
          </tr>
          <tr>
            <td>Habitat: </td>
            <td>
              <b>{pokemon.habitat}</b>
            </td>
          </tr>
          <tr>
            <td>Tipo: </td>
            <td>
              <b>{pokemon.types.join(', ')}</b>
            </td>
          </tr>
        </tbody>
      </table>
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
