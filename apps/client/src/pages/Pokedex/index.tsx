import { useEffect, useState } from 'react';

import { Pokemon, getPokemons } from '../../api/pokemons';

import PokemonCard from './PokemonCard';
import styles from './index.module.scss';

const Pokedex = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  useEffect(() => {
    getPokemons().then((newPokemons) => setPokemons(newPokemons));
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
