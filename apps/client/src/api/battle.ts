import { Operation } from '@mathemon/common/models/operation';
import {
  BattleState,
  ClientToServer,
  ClientToServerEvents,
  InitializationData,
  ServerToClient,
  ServerToClientEvents,
} from '@mathemon/common/models/websocket/battle';
import { Socket, io } from 'socket.io-client';

type BattleParams = {
  token: string;
  initialize: (data: InitializationData) => void;
  setState: (state: BattleState) => void;
  setChallenge: (challenge: Operation, time: number) => void;
  setUserHealth: (health: number) => void;
  setOpponentHealth: (health: number) => void;
};

type Battle = {
  disconnect: () => void;
  next: () => void;
  challengeResult: (result: number) => void;
};

const battle = ({
  token,
  initialize,
  setState,
  setChallenge,
  setUserHealth,
  setOpponentHealth,
}: BattleParams): Battle => {
  const socket: Socket<ServerToClient, ClientToServer> = io(window.location.host, {
    path: '/websocket',
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on(ServerToClientEvents.Initialization, (data: InitializationData) => {
    initialize(data);
  });

  socket.on(ServerToClientEvents.State, (state: BattleState) => {
    setState(state);
  });

  socket.on(ServerToClientEvents.Challenge, (challenge: Operation, time: number) => {
    setChallenge(challenge, time);
  });

  socket.on(ServerToClientEvents.OpponentHealth, (health: number) => {
    setOpponentHealth(health);
  });

  socket.on(ServerToClientEvents.UserHealth, (health: number) => {
    setUserHealth(health);
  });

  socket.on('connect', () => {
    // TODO: should we do something here?
  });

  socket.on('disconnect', () => {
    // TODO: should we do something here?
  });

  socket.on('connect_error', (err) => {
    console.error(err);
  });

  return {
    disconnect: () => socket.disconnect(),
    next: () => socket.emit(ClientToServerEvents.Next),
    challengeResult: (result: number) => socket.emit(ClientToServerEvents.ChallengeResult, result),
  };
};

export default battle;
