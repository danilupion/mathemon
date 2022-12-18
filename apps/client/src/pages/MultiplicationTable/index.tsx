import { useParams } from 'react-router-dom';

import { Operator } from '../../models/ArithmeticOperation';
import { range } from '../../utils/math';

import styles from './index.module.scss';

const numbers = range(1, 10);

const MultiplicationTable = () => {
  const { table } = useParams();

  const tableToUse = Number(table);

  if (!Number.isInteger(tableToUse)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Tabla del {table}</div>
      {numbers.map((number) => (
        <div key={number} className={styles.entry}>
          {`${tableToUse} ${Operator.multiplication} ${number} = ${tableToUse * number}`}
        </div>
      ))}
    </div>
  );
};

export default MultiplicationTable;
