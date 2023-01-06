import { PokedexMeta } from '@mathemon/common/models/api/me';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import Card from '../../../components/Card';
import Input from '../../../components/Form/Input';

import styles from './index.module.scss';

interface PokedexStatsProps {
  stats: PokedexMeta;
  initialFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const filterDebounce = 500;

const PokedexStats = ({ stats, initialFilter = '', onFilterChange }: PokedexStatsProps) => {
  const [search, setSearch] = useState(initialFilter);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((value: string) => {
      onFilterChange && onFilterChange(value);
    }, filterDebounce),
    [onFilterChange],
  );

  useEffect(() => {
    debouncedFilter(search);
  }, [search, debouncedFilter]);

  return (
    <Card className={styles.container}>
      <div className={styles.stats}>
        <div>Total: {stats.total}</div>
        <div>Encontrados: {stats.found}</div>
        <div>Capturados: {stats.captured}</div>
      </div>
      <Input value={search} onValueChange={setSearch} placeholder="Buscar..." />
    </Card>
  );
};

export default PokedexStats;
