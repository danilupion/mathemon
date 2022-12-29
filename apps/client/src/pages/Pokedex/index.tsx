import { Pokemon } from '@mathemon/common/models/pokemon';
import { useEffect, useState } from 'react';

import { getPokedex } from '../../api/pokedex';

import PokemonCard from './PokemonCard';
import styles from './index.module.scss';

const Pokedex = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  useEffect(() => {
    getPokedex().then((newPokemons) => setPokemons(newPokemons));
  }, [setPokemons]);

  return (
    <div className={styles.container}>
      <h2>Pokedex</h2>
      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};
export default Pokedex;
