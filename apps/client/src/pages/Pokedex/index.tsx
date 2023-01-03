import { Pokemon } from '@mathemon/common/models/pokemon';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { getPokedex } from '../../api/me';
import { useAuthStore } from '../../hooks/useStore';

import PokemonCard from './PokemonCard';
import styles from './index.module.scss';

const Pokedex = observer(() => {
  const authStore = useAuthStore();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  useEffect(() => {
    if (authStore.signedIn) {
      getPokedex().then((newPokemons) => setPokemons(newPokemons));
    }
  }, [authStore.signedIn, setPokemons]);

  if (!authStore.signedIn) {
    return <div className={styles.container}>Necesitas iniciar sesión para ver tu pokedex</div>;
  }

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
});

export default Pokedex;
