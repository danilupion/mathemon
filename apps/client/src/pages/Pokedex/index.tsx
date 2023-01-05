import { Pokemon } from '@mathemon/common/models/pokemon';
import { observer } from 'mobx-react-lite';

import { getPokedex } from '../../api/me';
import usePagination from '../../hooks/usePagination';
import { useAuthStore } from '../../hooks/useStore';

import PokemonCard from './PokemonCard';
import styles from './index.module.scss';

const Pokedex = observer(() => {
  const authStore = useAuthStore();

  if (!authStore.signedIn) {
    return <div className={styles.container}>Necesitas iniciar sesión para ver tu pokedex</div>;
  }

  const pokemons = usePagination<Pokemon>({ fetcher: getPokedex });

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
