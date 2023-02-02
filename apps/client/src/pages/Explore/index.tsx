import { Pokemon } from '@mathemon/common/models/pokemon';
import { BattleState } from '@mathemon/common/models/websocket/battle';
import { sample } from 'lodash';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import battle from '../../api/battle';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import PokemonImage, { PokemonImageType } from '../../components/PokemonImage';
import Progress from '../../components/Progress';
import QuizItem, { Item } from '../../components/QuizItem';
import Timer from '../../components/Timer';
import { useAuthStore } from '../../hooks/useStore';

import styles from './index.module.scss';

const NotLoggedInExplore = () => (
  <div className={styles.container}>
    Necesitas iniciar sesión para poder explorar con tu pokemon
  </div>
);

interface ActionProps {
  userPokemon: Pokemon;
  opponentPokemon: Pokemon;
  state: BattleState;
  onClick?: () => void;
  item?: Item;
  challengeTime?: number;
  updateItemValue: (value: number | undefined) => void;
  onSendChallengeResult: () => void;
}

const Actions = ({
  userPokemon,
  opponentPokemon,
  state,
  onClick,
  item,
  challengeTime,
  updateItemValue,
  onSendChallengeResult,
}: ActionProps) => {
  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      onSendChallengeResult();
    },
    [onSendChallengeResult],
  );

  return (
    <Card className={styles.actions}>
      {(() => {
        switch (state) {
          case BattleState.Starting:
            return (
              <h2>
                ¡Apareció un <span className={styles.pokemonName}>{opponentPokemon.name}</span>{' '}
                salvaje!
              </h2>
            );
          case BattleState.UserAttack:
            return (
              <>
                <h2>¡Elige un ataque!</h2>
                <div className={styles.buttons}>
                  {userPokemon.moves.slice(0, 5).map((h) => (
                    <Button key={h} onClick={onClick}>
                      {h}
                    </Button>
                  ))}
                </div>
              </>
            );
          case BattleState.OpponentAttack:
            return (
              <>
                <h2>
                  <span className={styles.pokemonName}>{opponentPokemon.name}</span> te ataca con{' '}
                  {sample(opponentPokemon.moves)}, ¡Elige un movimiento de evasión!
                </h2>
                <div className={styles.buttons}>
                  {userPokemon.abilities.map((h) => (
                    <Button key={h} onClick={onClick}>
                      {h}
                    </Button>
                  ))}
                </div>
              </>
            );
          case BattleState.Challenge:
            return (
              <>
                <h2>¡Resuelve la operación para que sea efectivo!</h2>
                <Timer ms={challengeTime!} />
                <form onSubmit={handleSubmit}>
                  <QuizItem item={item!} editable={true} onSetValue={updateItemValue} />
                  <Button className={styles.send} onClick={onSendChallengeResult}>
                    Resolver
                  </Button>
                </form>
              </>
            );
          case BattleState.Won:
            return <h2>¡Has ganado!</h2>;
          case BattleState.Lost:
            return <h2>¡Has perdido!</h2>;
        }
      })()}
    </Card>
  );
};

const LoggedInExplore = () => {
  const authStore = useAuthStore();
  const [state, setState] = useState<BattleState>(BattleState.Starting);
  const [userPokemon, setUserPokemon] = useState<Pokemon>();
  const [opponentPokemon, setOpponentPokemon] = useState<Pokemon>();
  const [userMaxHealth, setUserMaxHealth] = useState(0);
  const [userHealth, setUserHealth] = useState(0);
  const [opponentMaxHealth, setOpponentMaxHealth] = useState(0);
  const [opponentHealth, setOpponentHealth] = useState(0);
  const [item, setItem] = useState<Item>();
  const [challengeTime, setChallengeTime] = useState<number>();
  const nextAction = useRef<() => void>();
  const challengeResultAction = useRef<(result: number) => void>();

  const updateItemValueHandler = useCallback(
    (value: number | undefined) => {
      setItem({
        ...item,
        solution: {
          operation: item!.solution.operation,
          value,
        },
      });
    },
    [item],
  );

  const sendChallengeResultHandler = useCallback(() => {
    challengeResultAction.current!(item!.solution.value!);
  }, [item]);

  useEffect(() => {
    const { disconnect, next, challengeResult } = battle({
      token: authStore.token!,
      initialize: ({ user, opponent }) => {
        setUserPokemon(user.pokemon);
        setOpponentPokemon(opponent.pokemon);
        setUserMaxHealth(user.health);
        setUserHealth(user.health);
        setOpponentMaxHealth(opponent.health);
        setOpponentHealth(opponent.health);
      },
      setState,
      setChallenge: (challenge, time) => {
        setItem({
          solution: {
            operation: challenge,
          },
        });
        setChallengeTime(time);
        setState(BattleState.Challenge);
      },
      setUserHealth,
      setOpponentHealth,
    });

    nextAction.current = next;
    challengeResultAction.current = challengeResult;

    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userPokemon || !opponentPokemon) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pokemons}>
        <div className={styles.player}>
          <Progress value={userHealth} max={userMaxHealth} />
          <PokemonImage pokemon={userPokemon.number} type={PokemonImageType.Back} />
        </div>
        <div className={styles.opponent}>
          <Progress value={opponentHealth} max={opponentMaxHealth} />
          <PokemonImage pokemon={opponentPokemon.number} />
        </div>
      </div>
      <Actions
        userPokemon={userPokemon}
        opponentPokemon={opponentPokemon}
        state={state}
        onClick={nextAction.current}
        item={item}
        challengeTime={challengeTime}
        updateItemValue={updateItemValueHandler}
        onSendChallengeResult={sendChallengeResultHandler}
      />
    </div>
  );
};

const Explore = observer(() => {
  const authStore = useAuthStore();

  return authStore.signedIn ? <LoggedInExplore /> : <NotLoggedInExplore />;
});

export default Explore;
