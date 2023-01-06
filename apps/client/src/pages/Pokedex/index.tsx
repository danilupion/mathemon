import { PokedexMeta } from '@mathemon/common/models/api/me';
import { Pokemon } from '@mathemon/common/models/pokemon';
import { curryRight } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';

import { getPokedex } from '../../api/me';
import usePagination from '../../hooks/usePagination';
import { useAuthStore } from '../../hooks/useStore';

import PokedexStas from './PokedexStats';
import PokemonCard from './PokemonCard';
import styles from './index.module.scss';

const curriedGetPokedex = curryRight(getPokedex, 2);

const Pokedex = observer(() => {
  const authStore = useAuthStore();

  if (!authStore.signedIn) {
    return <div className={styles.container}>Necesitas iniciar sesión para ver tu pokedex</div>;
  }

  const [filter, setFilter] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetcher = useCallback(curriedGetPokedex(filter), [filter]);
  const [pokemons, meta] = usePagination<Pokemon, PokedexMeta>({ fetcher });

  return (
    <div className={styles.container}>
      <h2>Pokedex</h2>
      {meta && <PokedexStas stats={meta} onFilterChange={setFilter} initialFilter={filter} />}
      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
});

export default Pokedex;
