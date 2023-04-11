import { PokedexPokemonRes } from '@mathemon/common/models/api/me';
import { Operator } from '@mathemon/common/models/operation';
import classNames from 'classnames';

import Card from '../../../components/Card';
import PokemonImage from '../../../components/PokemonImage';

import styles from './index.module.scss';

interface PokemonCardProps {
  pokemon: PokedexPokemonRes;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  console.log(pokemon, typeof pokemon.name, pokemon.name);
  return (
    <Card
      key={pokemon.id}
      title={pokemon.name}
      className={classNames(styles.container, {
        [styles.addition]: pokemon.operator === Operator.addition,
        [styles.subtraction]: pokemon.operator === Operator.subtraction,
        [styles.multiplication]: pokemon.operator === Operator.multiplication,
        [styles.division]: pokemon.operator === Operator.division,
      })}
    >
      <div className={styles.id}>#{pokemon.number}</div>
      {pokemon.count > 0 && <div className={styles.count}>x{pokemon.count}</div>}
      <div className={styles.level}>Lv{pokemon.evolutionLevel}</div>
      <div className={styles.image}>
        <PokemonImage
          pokemon={pokemon}
          className={classNames({
            [styles.unknown]: pokemon.name === undefined && pokemon.habitat === undefined,
            [styles.found]: pokemon.name !== undefined && pokemon.habitat === undefined,
            [styles.captured]: pokemon.name !== undefined && pokemon.habitat !== undefined,
          })}
        />
      </div>
    </Card>
  );
};

export default PokemonCard;
