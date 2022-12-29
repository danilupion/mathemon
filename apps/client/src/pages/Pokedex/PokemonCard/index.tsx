import { Pokemon } from '@mathemon/common/models/pokemon';

import Card from '../../../components/Card';
import PokemonImage, { PokemonImageType } from '../../../components/PokemonImage';

import styles from './index.module.scss';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Card key={pokemon.id} title={pokemon.name}>
      <table className={styles['pokemon-stats']}>
        <tbody>
          <tr>
            <td>#: </td>
            <td>
              <b>{pokemon.number}</b>
            </td>
          </tr>
          <tr>
            <td>Generación: </td>
            <td>
              <b>{pokemon.generation}</b>
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
        <PokemonImage pokemon={pokemon} />
        <PokemonImage pokemon={pokemon} type={PokemonImageType.Back} />
        <PokemonImage pokemon={pokemon} type={PokemonImageType.Icon} />
      </div>
    </Card>
  );
};

export default PokemonCard;
