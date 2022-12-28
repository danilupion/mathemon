import Card from '../../components/Card';

import styles from './index.module.scss';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <Card>No hemos podido encontrar lo que buscas</Card>
    </div>
  );
};

export default NotFound;
