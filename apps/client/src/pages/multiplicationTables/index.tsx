import { Link } from 'react-router-dom';

import { range } from '../../utils/math';

import styles from './index.module.scss';

const tables = range(1, 10);

const MultiplicationTables = () => {
  return (
    <div className={styles.container}>
      {tables.map((table) => (
        <Link key={table} to={`/multiplicationTables/${table}`}>
          Tabla del {table}
        </Link>
      ))}
    </div>
  );
};

export default MultiplicationTables;
