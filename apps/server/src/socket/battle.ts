import { Operation, Operator } from '@mathemon/common/models/operation.js';
import {
  BattleState,
  ClientToServer,
  ClientToServerEvents,
  ServerToClient,
  ServerToClientEvents,
} from '@mathemon/common/models/websocket/battle.js';
import config from 'config';
import { ObjectId } from 'mongoose';
import { Socket } from 'socket.io';

import PokemonModel from '../models/pokemon.js';
import { createOperation, isCorrect } from '../utils/operation.js';

const pokemonGenerations = config.get<number[]>('settings.pokemon.generations');

const welcomeDelay = 5000;
const resultDelay = 10000;

const getRandPokemon = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (await PokemonModel.findById(
    (
      await PokemonModel.aggregate<{ _id: ObjectId }>([
        {
          $match: {
            $and: [{ generation: { $in: pokemonGenerations } }],
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
        { $sample: { size: 1 } },
      ])
    )[0]._id,
  ).exec())!;
};

const battleMiddleware = async (
  socket: Socket<ClientToServer, ServerToClient>,
  next: (err?: Error) => void,
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userPokemon = (await PokemonModel.findOne({ number: 25 }).exec())!;
  const opponentPokemon = await getRandPokemon();
  let state: BattleState = BattleState.Starting;
  let previousState: BattleState | undefined;
  let operation: Operation | undefined;
  let userHealth = 100;
  let opponentHealth = 100;
  let resultTimeout: NodeJS.Timeout | undefined;

  const nextTurn = () => {
    operation = undefined;
    if (userHealth <= 0 || opponentHealth <= 0) {
      state = userHealth > 0 ? BattleState.Won : BattleState.Lost;
      socket.emit(ServerToClientEvents.State, state);
      socket.disconnect();
    } else {
      state =
        previousState === BattleState.OpponentAttack
          ? BattleState.UserAttack
          : BattleState.OpponentAttack;
      socket.emit(ServerToClientEvents.State, state);
    }
  };

  socket.emit(ServerToClientEvents.Initialization, {
    user: {
      pokemon: userPokemon.toJSON(),
      health: userHealth,
    },
    opponent: {
      pokemon: opponentPokemon.toJSON(),
      health: opponentHealth,
    },
  });

  setTimeout(() => {
    state = BattleState.UserAttack;
    socket.emit(ServerToClientEvents.State, state);
  }, welcomeDelay);

  socket.on(ClientToServerEvents.Next, () => {
    if (state !== BattleState.UserAttack && state !== BattleState.OpponentAttack) {
      return;
    }

    previousState = state;
    state = BattleState.Challenge;
    operation = createOperation({ operator: Operator.addition, digits: 1, carrying: false });
    socket.emit(ServerToClientEvents.Challenge, operation, resultDelay);

    resultTimeout = setTimeout(() => {
      if (previousState === BattleState.OpponentAttack) {
        userHealth -= 25;
        socket.emit(ServerToClientEvents.UserHealth, userHealth);
      }
      resultTimeout = undefined;
      nextTurn();
    }, resultDelay);
  });

  socket.on(ClientToServerEvents.ChallengeResult, (value: number) => {
    if (state !== BattleState.Challenge) {
      return;
    }

    if (resultTimeout) {
      clearTimeout(resultTimeout);
      resultTimeout = undefined;
    }

    if (operation) {
      if (isCorrect({ operation, value })) {
        if (previousState === BattleState.UserAttack) {
          opponentHealth -= 25;
          socket.emit(ServerToClientEvents.OpponentHealth, opponentHealth);
        }
      } else {
        if (previousState === BattleState.OpponentAttack) {
          userHealth -= 25;
          socket.emit(ServerToClientEvents.UserHealth, userHealth);
        }
      }
    }

    nextTurn();
  });

  next();
};

export default battleMiddleware;
