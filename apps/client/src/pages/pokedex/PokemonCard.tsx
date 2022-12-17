import { Pokemon } from '../../api/pokemons';
import Card from '../../components/card';
import PokemonImage, { PokemonImageType } from '../../components/pokemonImage';

import styles from './PokemonCard.module.scss';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Card key={pokemon.id} title={pokemon.name}>
      <table className={styles['pokemon-stats']}>
        <tbody>
          <tr>
            <td>Id: </td>
            <td>
              <b>{pokemon.order}</b>
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
