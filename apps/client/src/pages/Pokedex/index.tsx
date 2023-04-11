import { PokedexMeta, PokedexPokemonRes } from '@mathemon/common/models/api/me';
import { curryRight } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';

import { getPokedex } from '../../api/me';
import Loader from '../../components/Loader';
import usePagination from '../../hooks/usePagination';
import { useAuthStore } from '../../hooks/useStore';

import PokedexStas from './PokedexStats';
import PokemonCard from './PokemonCard';
import styles from './index.module.scss';

const curriedGetPokedex = curryRight(getPokedex, 2);

const NotLoggedInPokedex = () => (
  <div className={styles.container}>Necesitas iniciar sesión para ver tu pokedex</div>
);

const LoggedInPokedex = () => {
  const [filter, setFilter] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetcher = useCallback(curriedGetPokedex(filter), [filter]);
  const {
    data: pokemons,
    fetching,
    meta,
  } = usePagination<PokedexPokemonRes, PokedexMeta>({ fetcher });

  return (
    <div className={styles.container}>
      <h2>Pokedex</h2>
      {meta && <PokedexStas stats={meta} onFilterChange={setFilter} initialFilter={filter} />}
      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      {fetching && <Loader />}
    </div>
  );
};

const Pokedex = observer(() => {
  const authStore = useAuthStore();

  return authStore.signedIn ? <LoggedInPokedex /> : <NotLoggedInPokedex />;
});

export default Pokedex;
