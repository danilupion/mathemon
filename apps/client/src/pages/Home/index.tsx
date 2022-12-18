import styles from './index.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <i className="nes-ash"></i>
      <div className="nes-balloon from-left">
        ¡Aprendamos mates! Seleciona las operaciones que quieres practicar en el menú de la
        izquierda, en el menú de la derecha podrás seleccionar la dificultad.
      </div>
    </div>
  );
};

export default Home;
