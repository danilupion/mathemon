import styles from './index.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className="">
        ¡Aprendamos mates! Seleciona las operaciones que quieres practicar en el menú de la
        izquierda, en el menú de la derecha podrás seleccionar la dificultad.
      </div>
      <i></i>
    </div>
  );
};

export default Home;
