import { Operation } from '../operation.js';
import { Pokemon } from '../pokemon.js';

export enum ServerToClientEvents {
  Initialization = 'initialization',
  State = 'state',
  Challenge = 'challenge',
  OpponentHealth = 'opponent-health',
  UserHealth = 'user-health',
}

type BattlePlayer = {
  pokemon: Pokemon;
  health: number;
};

export type InitializationData = {
  user: BattlePlayer;
  opponent: BattlePlayer;
};

export enum BattleState {
  Starting = 'starting',
  UserAttack = 'user-attack',
  OpponentAttack = 'opponent-attack',
  Challenge = 'challenge',
  Won = 'won',
  Lost = 'lost',
}

export interface ServerToClient {
  [ServerToClientEvents.Initialization]: (data: InitializationData) => void;
  [ServerToClientEvents.State]: (state: BattleState) => void;
  [ServerToClientEvents.Challenge]: (challenge: Operation, time: number) => void;
  [ServerToClientEvents.OpponentHealth]: (health: number) => void;
  [ServerToClientEvents.UserHealth]: (health: number) => void;
}

export enum ClientToServerEvents {
  Next = 'next',
  ChallengeResult = 'result',
}

export interface ClientToServer {
  [ClientToServerEvents.Next]: () => void;
  [ClientToServerEvents.ChallengeResult]: (result: number) => void;
}
