import { PokedexMeta } from '@mathemon/common/models/api/me';

import Card from '../../../components/Card';

import styles from './index.module.scss';

interface PokedexStatsProps {
  stats: PokedexMeta;
}

const PokedexStas = ({ stats }: PokedexStatsProps) => {
  return (
    <Card className={styles.container}>
      <div>Total: {stats.total}</div>
      <div>Encontrados: {stats.found}</div>
      <div>Capturados: {stats.captured}</div>
    </Card>
  );
};

export default PokedexStas;
